-- Custom WebRTC Video Telemedicine System Migration
-- This migration adds support for custom WebRTC video conferencing without third-party dependencies

-- WebRTC Sessions Table
CREATE TABLE IF NOT EXISTS webrtc_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) UNIQUE NOT NULL,
  room_id VARCHAR(255) UNIQUE NOT NULL,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL CHECK (status IN ('waiting', 'active', 'ended', 'cancelled')) DEFAULT 'waiting',
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  recording_url TEXT,
  participants TEXT[] DEFAULT '{}',
  quality VARCHAR(20) CHECK (quality IN ('low', 'medium', 'high', 'ultra')) DEFAULT 'high',
  bandwidth INTEGER DEFAULT 0,
  server_region VARCHAR(50) DEFAULT 'default',
  load_balanced BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- WebRTC Chat Messages Table
CREATE TABLE IF NOT EXISTS webrtc_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) NOT NULL,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sender_name VARCHAR(255) NOT NULL,
  sender_role VARCHAR(20) NOT NULL CHECK (sender_role IN ('patient', 'doctor')),
  message TEXT NOT NULL,
  message_type VARCHAR(20) CHECK (message_type IN ('text', 'file', 'image', 'system')) DEFAULT 'text',
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- WebRTC Recording Sessions Table
CREATE TABLE IF NOT EXISTS webrtc_recordings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) NOT NULL,
  recording_url TEXT NOT NULL,
  file_size BIGINT,
  duration INTEGER, -- in seconds
  quality VARCHAR(20) CHECK (quality IN ('low', 'medium', 'high', 'ultra')),
  format VARCHAR(10) CHECK (format IN ('mp4', 'webm', 'mkv')) DEFAULT 'mp4',
  status VARCHAR(20) CHECK (status IN ('recording', 'completed', 'failed', 'deleted')) DEFAULT 'recording',
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Load Distribution Servers Table
CREATE TABLE IF NOT EXISTS load_distribution_servers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_name VARCHAR(255) UNIQUE NOT NULL,
  server_region VARCHAR(50) NOT NULL,
  server_url VARCHAR(255) NOT NULL,
  server_type VARCHAR(20) CHECK (server_type IN ('signaling', 'media', 'storage', 'compute')) NOT NULL,
  capacity INTEGER NOT NULL, -- max concurrent sessions
  current_load INTEGER DEFAULT 0,
  status VARCHAR(20) CHECK (status IN ('active', 'maintenance', 'offline')) DEFAULT 'active',
  health_check_url VARCHAR(255),
  last_health_check TIMESTAMP WITH TIME ZONE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- WebRTC Session Analytics Table
CREATE TABLE IF NOT EXISTS webrtc_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  metric_type VARCHAR(50) NOT NULL, -- 'bandwidth', 'latency', 'packet_loss', 'quality'
  metric_value DECIMAL(10,4) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB
);

-- WebRTC Quality Settings Table
CREATE TABLE IF NOT EXISTS webrtc_quality_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quality_level VARCHAR(20) CHECK (quality_level IN ('low', 'medium', 'high', 'ultra')) UNIQUE NOT NULL,
  video_width INTEGER NOT NULL,
  video_height INTEGER NOT NULL,
  video_fps INTEGER NOT NULL,
  video_bitrate INTEGER NOT NULL, -- kbps
  audio_bitrate INTEGER NOT NULL, -- kbps
  audio_channels INTEGER DEFAULT 1,
  audio_sample_rate INTEGER DEFAULT 48000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default quality settings
INSERT INTO webrtc_quality_settings (quality_level, video_width, video_height, video_fps, video_bitrate, audio_bitrate) VALUES
('low', 640, 480, 15, 500, 64),
('medium', 1280, 720, 30, 1500, 128),
('high', 1920, 1080, 30, 3000, 256),
('ultra', 2560, 1440, 60, 6000, 320)
ON CONFLICT (quality_level) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_webrtc_sessions_room_id ON webrtc_sessions(room_id);
CREATE INDEX IF NOT EXISTS idx_webrtc_sessions_patient_id ON webrtc_sessions(patient_id);
CREATE INDEX IF NOT EXISTS idx_webrtc_sessions_doctor_id ON webrtc_sessions(doctor_id);
CREATE INDEX IF NOT EXISTS idx_webrtc_sessions_server_region ON webrtc_sessions(server_region);
CREATE INDEX IF NOT EXISTS idx_webrtc_sessions_status ON webrtc_sessions(status);

CREATE INDEX IF NOT EXISTS idx_webrtc_chat_messages_session_id ON webrtc_chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_webrtc_chat_messages_created_at ON webrtc_chat_messages(created_at);

CREATE INDEX IF NOT EXISTS idx_webrtc_recordings_session_id ON webrtc_recordings(session_id);
CREATE INDEX IF NOT EXISTS idx_webrtc_recordings_status ON webrtc_recordings(status);

CREATE INDEX IF NOT EXISTS idx_load_distribution_servers_region ON load_distribution_servers(server_region);
CREATE INDEX IF NOT EXISTS idx_load_distribution_servers_type ON load_distribution_servers(server_type);
CREATE INDEX IF NOT EXISTS idx_load_distribution_servers_status ON load_distribution_servers(status);

CREATE INDEX IF NOT EXISTS idx_webrtc_analytics_session_id ON webrtc_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_webrtc_analytics_timestamp ON webrtc_analytics(timestamp);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop triggers if they exist (to avoid conflicts)
DROP TRIGGER IF EXISTS update_webrtc_sessions_updated_at ON webrtc_sessions;
DROP TRIGGER IF EXISTS update_webrtc_recordings_updated_at ON webrtc_recordings;
DROP TRIGGER IF EXISTS update_load_distribution_servers_updated_at ON load_distribution_servers;
DROP TRIGGER IF EXISTS update_webrtc_quality_settings_updated_at ON webrtc_quality_settings;

-- Create triggers
CREATE TRIGGER update_webrtc_sessions_updated_at 
    BEFORE UPDATE ON webrtc_sessions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_webrtc_recordings_updated_at 
    BEFORE UPDATE ON webrtc_recordings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_load_distribution_servers_updated_at 
    BEFORE UPDATE ON load_distribution_servers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_webrtc_quality_settings_updated_at 
    BEFORE UPDATE ON webrtc_quality_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE webrtc_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE webrtc_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE webrtc_recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE webrtc_analytics ENABLE ROW LEVEL SECURITY;

-- Drop policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Doctors can create WebRTC sessions" ON webrtc_sessions;
DROP POLICY IF EXISTS "Doctors can update their WebRTC sessions" ON webrtc_sessions;
DROP POLICY IF EXISTS "Users can view their own sessions" ON webrtc_sessions;
DROP POLICY IF EXISTS "Users can send chat messages in their sessions" ON webrtc_chat_messages;
DROP POLICY IF EXISTS "Users can view chat messages in their sessions" ON webrtc_chat_messages;

-- RLS Policies for webrtc_sessions
CREATE POLICY "Doctors can create WebRTC sessions" ON webrtc_sessions
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() IN (SELECT user_id FROM doctors WHERE id = doctor_id));

CREATE POLICY "Doctors can update their WebRTC sessions" ON webrtc_sessions
    FOR UPDATE TO authenticated
    USING (auth.uid() IN (SELECT user_id FROM doctors WHERE id = doctor_id));

CREATE POLICY "Users can view their own sessions" ON webrtc_sessions
    FOR SELECT TO authenticated
    USING (
        auth.uid() IN (
            SELECT user_id FROM doctors WHERE id = doctor_id
            UNION
            SELECT user_id FROM patients WHERE id = patient_id
        )
    );

-- RLS Policies for webrtc_chat_messages
CREATE POLICY "Users can send chat messages in their sessions" ON webrtc_chat_messages
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can view chat messages in their sessions" ON webrtc_chat_messages
    FOR SELECT TO authenticated
    USING (
        session_id IN (
            SELECT session_id FROM webrtc_sessions 
            WHERE doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid())
            OR patient_id IN (SELECT id FROM patients WHERE user_id = auth.uid())
        )
    );

-- Function to get optimal server for load distribution
CREATE OR REPLACE FUNCTION get_optimal_server(
    p_region VARCHAR(50) DEFAULT 'default',
    p_server_type VARCHAR(20) DEFAULT 'signaling'
)
RETURNS TABLE (
    id UUID,
    server_name VARCHAR(255),
    server_url VARCHAR(255),
    current_load INTEGER,
    capacity INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        lds.id,
        lds.server_name,
        lds.server_url,
        lds.current_load,
        lds.capacity
    FROM load_distribution_servers lds
    WHERE lds.server_region = p_region
        AND lds.server_type = p_server_type
        AND lds.status = 'active'
        AND lds.current_load < lds.capacity
    ORDER BY (lds.current_load::DECIMAL / lds.capacity) ASC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Function to update server load
CREATE OR REPLACE FUNCTION update_server_load(
    p_server_id UUID,
    p_load_change INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
    new_load INTEGER;
BEGIN
    UPDATE load_distribution_servers 
    SET current_load = GREATEST(0, current_load + p_load_change),
        updated_at = NOW()
    WHERE id = p_server_id;
    
    GET DIAGNOSTICS new_load = ROW_COUNT;
    RETURN new_load > 0;
END;
$$ LANGUAGE plpgsql;

-- Function to get session quality metrics
CREATE OR REPLACE FUNCTION get_session_quality_metrics(
    p_session_id VARCHAR(255),
    p_time_range INTERVAL DEFAULT '1 hour'
)
RETURNS TABLE (
    metric_type VARCHAR(50),
    avg_value DECIMAL(10,4),
    min_value DECIMAL(10,4),
    max_value DECIMAL(10,4),
    sample_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        wa.metric_type,
        AVG(wa.metric_value) as avg_value,
        MIN(wa.metric_value) as min_value,
        MAX(wa.metric_value) as max_value,
        COUNT(*) as sample_count
    FROM webrtc_analytics wa
    WHERE wa.session_id = p_session_id
        AND wa.timestamp >= NOW() - p_time_range
    GROUP BY wa.metric_type;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up old sessions
CREATE OR REPLACE FUNCTION cleanup_old_webrtc_sessions(
    p_days_old INTEGER DEFAULT 30
)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM webrtc_sessions 
    WHERE created_at < NOW() - (p_days_old || ' days')::INTERVAL
        AND status IN ('ended', 'cancelled');
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Insert default load distribution servers
INSERT INTO load_distribution_servers (server_name, server_region, server_url, server_type, capacity) VALUES
('signaling-primary', 'default', 'ws://localhost:4000/webrtc-signaling', 'signaling', 1000),
('signaling-secondary', 'default', 'ws://localhost:4001/webrtc-signaling', 'signaling', 1000),
('media-primary', 'default', 'http://localhost:4002/media', 'media', 500),
('storage-primary', 'default', 'http://localhost:4003/storage', 'storage', 100),
('compute-primary', 'default', 'http://localhost:4004/compute', 'compute', 200)
ON CONFLICT (server_name) DO NOTHING;

-- Note: Cron job creation is removed since pg_cron extension is not available
-- You can manually run cleanup_old_webrtc_sessions() or set up external cron jobs
