// ============================================
// Sentinel AI — Type Definitions
// ============================================

export type RiskLevel = 'critical' | 'high' | 'medium' | 'low' | 'minimal';
export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type DeviceStatus = 'online' | 'offline' | 'warning' | 'maintenance';
export type DeviceType = 'camera' | 'sensor' | 'gateway' | 'drone' | 'iot' | 'thermal';
export type IncidentStatus = 'active' | 'investigating' | 'contained' | 'resolved' | 'closed';
export type NotificationType = 'alert' | 'warning' | 'info' | 'success' | 'system' | 'critical';

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  badge?: number;
  children?: NavItem[];
}

export interface SidebarItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
  group?: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  details?: string[];
}

export interface RiskCategory {
  id: string;
  name: string;
  level: RiskLevel;
  score: number;
  trend: 'up' | 'down' | 'stable';
  icon: string;
  color: string;
  description: string;
  incidents: number;
  risk?: number;
  confidence?: number;
  status?: string;
  recommendation?: string;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  timestamp: string;
  location: string;
  source: string;
  acknowledged: boolean;
  riskCategory: string;
}

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  location: string;
  lastPing: string;
  battery?: number;
  signal?: number;
  firmware: string;
  zone: string;
  icon?: string;
  latency?: string;
  color?: string;
  uptime?: string;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  status: IncidentStatus;
  timestamp: string;
  location: string;
  assignedTo: string;
  riskCategory: string;
  responseTime: string;
  updates: IncidentUpdate[];
  time?: string;
  priority?: string;
  icon?: string;
}

export interface IncidentUpdate {
  id: string;
  message: string;
  timestamp: string;
  author: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  department: string;
  lastActive: string;
}

export interface Statistic {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  trend: number;
  icon: string;
  color: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'alert' | 'incident' | 'resolution' | 'system' | 'update';
  severity?: AlertSeverity;
  icon: string;
}

export interface Report {
  id: string;
  title: string;
  type: 'daily' | 'weekly' | 'monthly' | 'incident' | 'custom';
  generatedAt: string;
  status: 'ready' | 'generating' | 'failed';
  size: string;
  format: 'pdf' | 'csv' | 'json';
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface DashboardStats {
  totalThreats: number;
  activeAlerts: number;
  devicesOnline: number;
  riskScore: number;
  responseTime: string;
  accuracy: number;
}
