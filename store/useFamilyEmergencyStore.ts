import { create } from 'zustand';
import { useIncidentHistoryStore } from './useIncidentHistoryStore';
import { EventBus } from '@/iot/events/EventBus';

export interface FamilyContact {
  id: string;
  name: string;
  relationship: 'Daughter' | 'Son' | 'Spouse' | 'Parent' | 'Caregiver' | 'Doctor' | 'Sibling' | 'Other';
  phone: string;
  email: string;
  avatar: string;
  isPrimary: boolean;
  notifyViaSms: boolean;
  notifyViaCall: boolean;
  notifyViaPush: boolean;
  status: 'idle' | 'calling' | 'connected' | 'notified' | 'acknowledged';
  lastAlertTime?: string;
  lastResponse?: string;
}

export interface FamilyNotificationLog {
  id: string;
  contactName: string;
  relationship: string;
  channel: 'SMS' | 'VOICE_CALL' | 'PUSH' | 'WHATSAPP';
  phone: string;
  message: string;
  timestamp: string;
  status: 'DELIVERED' | 'RINGING' | 'ACKNOWLEDGED';
}

interface FamilyEmergencyStoreState {
  contacts: FamilyContact[];
  sentNotifications: FamilyNotificationLog[];
  isCallModalOpen: boolean;
  activeCallingContact: FamilyContact | null;
  activeFamilyAlert: {
    incidentId: string;
    reason: string;
    timestamp: string;
    zone: string;
    acknowledgedBy?: string;
  } | null;

  // Actions
  dispatchFamilyOnlySOS: (reason?: string, zoneName?: string, directContactId?: string) => void;
  closeCallModal: () => void;
  openCallModal: (contact: FamilyContact) => void;
  toggleContactChannel: (id: string, channel: 'notifyViaSms' | 'notifyViaCall' | 'notifyViaPush') => void;
  setPrimaryContact: (id: string) => void;
  addContact: (contact: Omit<FamilyContact, 'id' | 'status'>) => void;
  removeContact: (id: string) => void;
  simulateFamilyAcknowledgement: (contactId: string, responseMessage: string) => void;
}

const DEFAULT_FAMILY_CONTACTS: FamilyContact[] = [
  {
    id: 'fam-1',
    name: 'Sarah Davis',
    relationship: 'Daughter',
    phone: '+1 (555) 234-8901',
    email: 'sarah.davis@family.com',
    avatar: 'SD',
    isPrimary: true,
    notifyViaSms: true,
    notifyViaCall: true,
    notifyViaPush: true,
    status: 'idle',
  },
  {
    id: 'fam-2',
    name: 'Michael Davis',
    relationship: 'Son',
    phone: '+1 (555) 456-7812',
    email: 'michael.davis@family.com',
    avatar: 'MD',
    isPrimary: false,
    notifyViaSms: true,
    notifyViaCall: false,
    notifyViaPush: true,
    status: 'idle',
  },
  {
    id: 'fam-3',
    name: 'Elena Vance-Davis',
    relationship: 'Spouse',
    phone: '+1 (555) 890-1234',
    email: 'elena.vance@family.com',
    avatar: 'EV',
    isPrimary: false,
    notifyViaSms: true,
    notifyViaCall: true,
    notifyViaPush: true,
    status: 'idle',
  },
  {
    id: 'fam-4',
    name: 'Dr. Arthur Morgan',
    relationship: 'Doctor',
    phone: '+1 (555) 341-9988',
    email: 'dr.morgan@medclinic.org',
    avatar: 'AM',
    isPrimary: false,
    notifyViaSms: true,
    notifyViaCall: false,
    notifyViaPush: false,
    status: 'idle',
  },
];

export const useFamilyEmergencyStore = create<FamilyEmergencyStoreState>((set, get) => ({
  contacts: DEFAULT_FAMILY_CONTACTS,
  sentNotifications: [],
  isCallModalOpen: false,
  activeCallingContact: null,
  activeFamilyAlert: null,

  dispatchFamilyOnlySOS: (
    reason = 'Manual assistance requested by user',
    zoneName = 'Living Quarters / Bedroom',
    directContactId
  ) => {
    const contacts = get().contacts;
    const targetContact = directContactId
      ? contacts.find((c) => c.id === directContactId) || contacts[0]
      : contacts.find((c) => c.isPrimary) || contacts[0];

    const incidentId = `FAM-SOS-${Date.now().toString().slice(-6)}`;
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    const nowIso = new Date().toISOString();

    // 1. Generate Targeted Family Notification Logs (SMS & Push ONLY to family)
    const newLogs: FamilyNotificationLog[] = [];
    contacts.forEach((c) => {
      if (c.notifyViaSms) {
        newLogs.push({
          id: `notif-sms-${c.id}-${Date.now()}`,
          contactName: c.name,
          relationship: c.relationship,
          channel: 'SMS',
          phone: c.phone,
          message: `🚨 SENTINEL FAMILY ALERT: User requested direct assistance in ${zoneName}. Status: Alert & responsive. No public sirens dispatched. Call user or tap link to view live vitals: https://sentinel.ai/family/track-${incidentId.slice(-4)}`,
          timestamp,
          status: 'DELIVERED',
        });
      }
      if (c.notifyViaPush) {
        newLogs.push({
          id: `notif-push-${c.id}-${Date.now()}`,
          contactName: c.name,
          relationship: c.relationship,
          channel: 'PUSH',
          phone: c.phone,
          message: `URGENT: ${c.relationship} Help Request in ${zoneName}. Live link available.`,
          timestamp,
          status: 'DELIVERED',
        });
      }
      if (c.id === targetContact.id && c.notifyViaCall) {
        newLogs.push({
          id: `notif-call-${c.id}-${Date.now()}`,
          contactName: c.name,
          relationship: c.relationship,
          channel: 'VOICE_CALL',
          phone: c.phone,
          message: `Direct 2-way emergency audio call initiated to ${c.name} (${c.relationship})`,
          timestamp,
          status: 'RINGING',
        });
      }
    });

    // 2. Update contact statuses
    const updatedContacts = contacts.map((c) => {
      if (c.id === targetContact.id) {
        return {
          ...c,
          status: 'calling' as const,
          lastAlertTime: timestamp,
        };
      }
      return {
        ...c,
        status: 'notified' as const,
        lastAlertTime: timestamp,
      };
    });

    // 3. Log to central Incident Forensics Ledger
    try {
      useIncidentHistoryStore.getState().addEvent({
        incidentId,
        timestamp,
        relativeOffsetSec: 0.0,
        eventType: 'FAMILY_SOS_DISPATCHED',
        severity: 'CRITICAL',
        description: `Direct Family SOS triggered by user -> Notifying ${contacts.length} family contacts (Primary: ${targetContact.name})`,
        metadata: {
          primaryContact: `${targetContact.name} (${targetContact.relationship})`,
          phone: targetContact.phone,
          zone: zoneName,
          reason,
          dispatchScope: 'FAMILY_ONLY_CONFIDENTIAL',
        },
      });
    } catch (e) {
      console.error('Failed to log family SOS to incident store:', e);
    }

    // 4. Publish EventBus event
    try {
      EventBus.getInstance().publish(
        'FAMILY_SOS_TRIGGERED',
        {
          incidentId,
          targetContact: targetContact.name,
          phone: targetContact.phone,
          reason,
          zone: zoneName,
          timestamp: nowIso,
        },
        'FAMILY-SOS-CORE',
        'critical'
      );
    } catch (e) {
      console.error('Failed to publish family SOS event:', e);
    }

    // 5. Update store state and open active call modal
    set((state) => ({
      contacts: updatedContacts,
      sentNotifications: [...newLogs, ...state.sentNotifications],
      isCallModalOpen: true,
      activeCallingContact: targetContact,
      activeFamilyAlert: {
        incidentId,
        reason,
        timestamp,
        zone: zoneName,
      },
    }));

    // 6. Simulate automatic acknowledgment from family after 4 seconds
    setTimeout(() => {
      get().simulateFamilyAcknowledgement(
        targetContact.id,
        `"Dad, I got the alert! I'm 4 minutes away, stay calm!"`
      );
    }, 4500);
  },

  closeCallModal: () => set({ isCallModalOpen: false, activeCallingContact: null }),

  openCallModal: (contact) =>
    set({
      isCallModalOpen: true,
      activeCallingContact: contact,
    }),

  toggleContactChannel: (id, channel) =>
    set((state) => ({
      contacts: state.contacts.map((c) =>
        c.id === id ? { ...c, [channel]: !c[channel] } : c
      ),
    })),

  setPrimaryContact: (id) =>
    set((state) => ({
      contacts: state.contacts.map((c) => ({
        ...c,
        isPrimary: c.id === id,
      })),
    })),

  addContact: (newContact) => {
    const contact: FamilyContact = {
      ...newContact,
      id: `fam-${Date.now()}`,
      status: 'idle',
    };
    set((state) => ({ contacts: [...state.contacts, contact] }));
  },

  removeContact: (id) =>
    set((state) => ({
      contacts: state.contacts.filter((c) => c.id !== id),
    })),

  simulateFamilyAcknowledgement: (contactId, responseMessage) => {
    set((state) => {
      const updatedContacts = state.contacts.map((c) => {
        if (c.id === contactId) {
          return {
            ...c,
            status: 'connected' as const,
            lastResponse: responseMessage,
          };
        }
        return c;
      });

      const ackContact = state.contacts.find((c) => c.id === contactId);

      if (ackContact && state.activeFamilyAlert) {
        useIncidentHistoryStore.getState().addEvent({
          incidentId: state.activeFamilyAlert.incidentId,
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
          relativeOffsetSec: 4.5,
          eventType: 'SPEECH_INTENT_CAPTURED',
          severity: 'INFO',
          description: `Family Acknowledged: ${ackContact.name} (${ackContact.relationship}) connected to live call`,
          metadata: {
            contact: ackContact.name,
            response: responseMessage,
          },
        });
      }

      return {
        contacts: updatedContacts,
        activeFamilyAlert: state.activeFamilyAlert
          ? { ...state.activeFamilyAlert, acknowledgedBy: ackContact?.name }
          : null,
      };
    });
  },
}));
