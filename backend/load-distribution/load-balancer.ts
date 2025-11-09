import { api, APIError } from "encore.dev/api";
import { secret } from "encore.dev/config";
import { getAuthData } from "~encore/auth";
import { supabaseAdmin } from "../supabase/client";
import { EventEmitter } from 'events';
import axios from 'axios';

// Load Distribution Manager
class LoadDistributionManager extends EventEmitter {
  private servers: Map<string, ServerInfo> = new Map();
  private regions: Map<string, RegionInfo> = new Map();
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private loadUpdateInterval: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.initializeLoadDistribution();
  }

  private async initializeLoadDistribution() {
    await this.loadServersFromDatabase();
    this.startHealthChecks();
    this.startLoadUpdates();
    console.log('Load Distribution Manager initialized');
  }

  private async loadServersFromDatabase() {
    try {
      const { data: servers, error } = await supabaseAdmin
        .from('load_distribution_servers')
        .select('*')
        .eq('status', 'active');

      if (error) {
        console.error('Failed to load servers from database:', error);
        return;
      }

      servers?.forEach(server => {
        this.servers.set(server.server_name, {
          id: server.id,
          name: server.server_name,
          region: server.server_region,
          url: server.server_url,
          type: server.server_type,
          capacity: server.capacity,
          currentLoad: server.current_load,
          status: server.status,
          lastHealthCheck: server.last_health_check ? new Date(server.last_health_check) : null,
          metadata: server.metadata || {}
        });

        // Initialize region if not exists
        if (!this.regions.has(server.server_region)) {
          this.regions.set(server.server_region, {
            name: server.server_region,
            servers: [],
            totalCapacity: 0,
            currentLoad: 0,
            healthScore: 100
          });
        }

        const region = this.regions.get(server.server_region)!;
        region.servers.push(server.server_name);
        region.totalCapacity += server.capacity;
        region.currentLoad += server.current_load;
      });

      console.log(`Loaded ${this.servers.size} servers across ${this.regions.size} regions`);
    } catch (error) {
      console.error('Error loading servers:', error);
    }
  }

  private startHealthChecks() {
    this.healthCheckInterval = setInterval(async () => {
      await this.performHealthChecks();
    }, 30000); // Check every 30 seconds
  }

  private startLoadUpdates() {
    this.loadUpdateInterval = setInterval(async () => {
      await this.updateLoadMetrics();
    }, 10000); // Update every 10 seconds
  }

  private async performHealthChecks() {
    const healthChecks = Array.from(this.servers.values()).map(async (server) => {
      try {
        const startTime = Date.now();
        const response = await axios.get(`${server.url}/health`, {
          timeout: 5000,
          headers: {
            'User-Agent': 'G1Cure-LoadBalancer/1.0'
          }
        });

        const responseTime = Date.now() - startTime;
        const isHealthy = response.status === 200 && responseTime < 2000;

        await this.updateServerHealth(server.id, isHealthy, responseTime);
        
        if (!isHealthy) {
          console.warn(`Server ${server.name} is unhealthy (${responseTime}ms)`);
          this.emit('server-unhealthy', server);
        }

        return { server: server.name, healthy: isHealthy, responseTime };
      } catch (error) {
        console.error(`Health check failed for ${server.name}:`, error);
        await this.updateServerHealth(server.id, false, 0);
        this.emit('server-unhealthy', server);
        return { server: server.name, healthy: false, responseTime: 0 };
      }
    });

    const results = await Promise.allSettled(healthChecks);
    const healthyCount = results.filter(r => 
      r.status === 'fulfilled' && r.value.healthy
    ).length;

    console.log(`Health check completed: ${healthyCount}/${this.servers.size} servers healthy`);
  }

  private async updateServerHealth(serverId: string, isHealthy: boolean, responseTime: number) {
    try {
      const { error } = await supabaseAdmin
        .from('load_distribution_servers')
        .update({
          status: isHealthy ? 'active' : 'offline',
          last_health_check: new Date().toISOString(),
          metadata: {
            last_response_time: responseTime,
            last_health_check: new Date().toISOString()
          }
        })
        .eq('id', serverId);

      if (error) {
        console.error('Failed to update server health:', error);
      }
    } catch (error) {
      console.error('Error updating server health:', error);
    }
  }

  private async updateLoadMetrics() {
    try {
      // Get current session counts from database
      const { data: sessions, error } = await supabaseAdmin
        .from('webrtc_sessions')
        .select('server_region, status')
        .eq('status', 'active');

      if (error) {
        console.error('Failed to get session data:', error);
        return;
      }

      // Calculate load per region
      const regionLoads = new Map<string, number>();
      sessions?.forEach(session => {
        const current = regionLoads.get(session.server_region) || 0;
        regionLoads.set(session.server_region, current + 1);
      });

      // Update region loads
      for (const [regionName, load] of regionLoads) {
        const region = this.regions.get(regionName);
        if (region) {
          region.currentLoad = load;
          const loadPercentage = (load / region.totalCapacity) * 100;
          region.healthScore = Math.max(0, 100 - loadPercentage);
        }
      }

      this.emit('load-updated', regionLoads);
    } catch (error) {
      console.error('Error updating load metrics:', error);
    }
  }

  public async getOptimalServer(
    region: string = 'default',
    serverType: string = 'signaling',
    userLocation?: { lat: number; lng: number }
  ): Promise<ServerInfo | null> {
    try {
      // Get optimal server from database
      const { data, error } = await supabaseAdmin.rpc('get_optimal_server', {
        p_region: region,
        p_server_type: serverType
      });

      if (error || !data || data.length === 0) {
        console.warn(`No optimal server found for region: ${region}, type: ${serverType}`);
        return null;
      }

      const serverData = data[0];
      const server = this.servers.get(serverData.server_name);
      
      if (server) {
        // Update server load
        await this.updateServerLoad(serverData.server_id, 1);
        server.currentLoad += 1;
        
        console.log(`Selected server: ${server.name} (load: ${server.currentLoad}/${server.capacity})`);
        return server;
      }

      return null;
    } catch (error) {
      console.error('Error getting optimal server:', error);
      return null;
    }
  }

  private async updateServerLoad(serverId: string, loadChange: number) {
    try {
      const { error } = await supabaseAdmin.rpc('update_server_load', {
        p_server_id: serverId,
        p_load_change: loadChange
      });

      if (error) {
        console.error('Failed to update server load:', error);
      }
    } catch (error) {
      console.error('Error updating server load:', error);
    }
  }

  public async releaseServerLoad(serverId: string) {
    await this.updateServerLoad(serverId, -1);
  }

  public getRegionInfo(region: string): RegionInfo | null {
    return this.regions.get(region) || null;
  }

  public getAllRegions(): RegionInfo[] {
    return Array.from(this.regions.values());
  }

  public getServerInfo(serverName: string): ServerInfo | null {
    return this.servers.get(serverName) || null;
  }

  public async addServer(serverInfo: Omit<ServerInfo, 'id'>): Promise<boolean> {
    try {
      const { data, error } = await supabaseAdmin
        .from('load_distribution_servers')
        .insert({
          server_name: serverInfo.name,
          server_region: serverInfo.region,
          server_url: serverInfo.url,
          server_type: serverInfo.type,
          capacity: serverInfo.capacity,
          current_load: serverInfo.currentLoad,
          status: serverInfo.status,
          metadata: serverInfo.metadata
        })
        .select()
        .single();

      if (error) {
        console.error('Failed to add server:', error);
        return false;
      }

      this.servers.set(serverInfo.name, {
        ...serverInfo,
        id: data.id
      });

      // Update region info
      if (!this.regions.has(serverInfo.region)) {
        this.regions.set(serverInfo.region, {
          name: serverInfo.region,
          servers: [],
          totalCapacity: 0,
          currentLoad: 0,
          healthScore: 100
        });
      }

      const region = this.regions.get(serverInfo.region)!;
      region.servers.push(serverInfo.name);
      region.totalCapacity += serverInfo.capacity;
      region.currentLoad += serverInfo.currentLoad;

      console.log(`Added server: ${serverInfo.name} to region: ${serverInfo.region}`);
      return true;
    } catch (error) {
      console.error('Error adding server:', error);
      return false;
    }
  }

  public async removeServer(serverName: string): Promise<boolean> {
    try {
      const server = this.servers.get(serverName);
      if (!server) {
        return false;
      }

      const { error } = await supabaseAdmin
        .from('load_distribution_servers')
        .delete()
        .eq('server_name', serverName);

      if (error) {
        console.error('Failed to remove server:', error);
        return false;
      }

      // Update region info
      const region = this.regions.get(server.region);
      if (region) {
        region.servers = region.servers.filter(s => s !== serverName);
        region.totalCapacity -= server.capacity;
        region.currentLoad -= server.currentLoad;
      }

      this.servers.delete(serverName);
      console.log(`Removed server: ${serverName}`);
      return true;
    } catch (error) {
      console.error('Error removing server:', error);
      return false;
    }
  }

  public stop() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    if (this.loadUpdateInterval) {
      clearInterval(this.loadUpdateInterval);
    }
    console.log('Load Distribution Manager stopped');
  }
}

// Types
export interface ServerInfo {
  id: string;
  name: string;
  region: string;
  url: string;
  type: 'signaling' | 'media' | 'storage' | 'compute';
  capacity: number;
  currentLoad: number;
  status: 'active' | 'maintenance' | 'offline';
  lastHealthCheck?: Date | null;
  metadata: Record<string, any>;
}

export interface RegionInfo {
  name: string;
  servers: string[];
  totalCapacity: number;
  currentLoad: number;
  healthScore: number;
}

// Global load distribution manager instance
let loadDistributionManager: LoadDistributionManager | null = null;

export function getLoadDistributionManager(): LoadDistributionManager {
  if (!loadDistributionManager) {
    loadDistributionManager = new LoadDistributionManager();
  }
  return loadDistributionManager;
}

// API endpoints for load distribution

export const getLoadDistributionStatus = api<{}, {
  regions: RegionInfo[];
  totalServers: number;
  totalCapacity: number;
  totalLoad: number;
  overallHealth: number;
}>(
  { expose: true, method: "GET", path: "/load-distribution/status", auth: true },
  async () => {
    const auth = getAuthData()!;
    
    if (auth.role !== 'admin') {
      throw APIError.permissionDenied("Only admins can view load distribution status");
    }

    const manager = getLoadDistributionManager();
    const regions = manager.getAllRegions();
    
    const totalServers = regions.reduce((sum, region) => sum + region.servers.length, 0);
    const totalCapacity = regions.reduce((sum, region) => sum + region.totalCapacity, 0);
    const totalLoad = regions.reduce((sum, region) => sum + region.currentLoad, 0);
    const overallHealth = regions.reduce((sum, region) => sum + region.healthScore, 0) / regions.length;

    return {
      regions,
      totalServers,
      totalCapacity,
      totalLoad,
      overallHealth: Math.round(overallHealth)
    };
  }
);

export const addLoadDistributionServer = api<{
  name: string;
  region: string;
  url: string;
  type: 'signaling' | 'media' | 'storage' | 'compute';
  capacity: number;
}, { success: boolean }>(
  { expose: true, method: "POST", path: "/load-distribution/servers", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    
    if (auth.role !== 'admin') {
      throw APIError.permissionDenied("Only admins can add servers");
    }

    const manager = getLoadDistributionManager();
    const success = await manager.addServer({
      name: req.name,
      region: req.region,
      url: req.url,
      type: req.type,
      capacity: req.capacity,
      currentLoad: 0,
      status: 'active',
      metadata: {}
    });

    return { success };
  }
);

export const removeLoadDistributionServer = api<{ name: string }, { success: boolean }>(
  { expose: true, method: "DELETE", path: "/load-distribution/servers/:name", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    
    if (auth.role !== 'admin') {
      throw APIError.permissionDenied("Only admins can remove servers");
    }

    const manager = getLoadDistributionManager();
    const success = await manager.removeServer(req.name);

    return { success };
  }
);

export const getOptimalServerForSession = api<{
  region?: string;
  serverType?: string;
  userLocation?: { lat: number; lng: number };
}, { server: ServerInfo | null }>(
  { expose: true, method: "POST", path: "/load-distribution/optimal-server", auth: true },
  async (req) => {
    const manager = getLoadDistributionManager();
    const server = await manager.getOptimalServer(
      req.region || 'default',
      req.serverType || 'signaling',
      req.userLocation
    );

    return { server };
  }
);
