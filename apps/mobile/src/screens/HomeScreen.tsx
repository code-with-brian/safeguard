import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/auth';

export default function HomeScreen() {
  const { childId, monitoringEnabled, toggleMonitoring } = useAuthStore();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={[
              styles.statusIndicator,
              { backgroundColor: monitoringEnabled ? '#22c55e' : '#ef4444' }
            ]} />
            <Text style={styles.statusText}>
              {monitoringEnabled ? 'Protection Active' : 'Protection Paused'}
            </Text>
          </View>
          <Text style={styles.statusDescription}>
            {monitoringEnabled
              ? 'SafeGuard is monitoring your messages to keep you safe online.'
              : 'SafeGuard monitoring is currently paused.'}
          </Text>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              { backgroundColor: monitoringEnabled ? '#ef4444' : '#22c55e' }
            ]}
            onPress={toggleMonitoring}
          >
            <Text style={styles.toggleButtonText}>
              {monitoringEnabled ? 'Pause Monitoring' : 'Resume Monitoring'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Safety Tips */}
        <Text style={styles.sectionTitle}>Safety Tips</Text>
        <View style={styles.tipsContainer}>
          {[
            {
              icon: 'lock-closed',
              title: 'Keep Personal Info Private',
              description: 'Never share your address, phone number, or school with strangers online.',
            },
            {
              icon: 'people',
              title: 'Think Before You Post',
              description: 'Once something is online, it can be hard to remove. Be mindful of what you share.',
            },
            {
              icon: 'alert-circle',
              title: 'Trust Your Instincts',
              description: 'If something feels wrong or uncomfortable, talk to a trusted adult.',
            },
            {
              icon: 'heart',
              title: 'Be Kind Online',
              description: 'Treat others the way you want to be treated. Cyberbullying hurts.',
            },
          ].map((tip, index) => (
            <View key={index} style={styles.tipCard}>
              <View style={styles.tipIcon}>
                <Ionicons name={tip.icon as any} size={24} color="#3b82f6" />
              </View>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>{tip.title}</Text>
                <Text style={styles.tipDescription}>{tip.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubbles" size={24} color="#3b82f6" />
            <Text style={styles.actionText}>Talk to Parent</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="shield" size={24} color="#3b82f6" />
            <Text style={styles.actionText}>Report Concern</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="call" size={24} color="#3b82f6" />
            <Text style={styles.actionText}>Crisis Help</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  scrollView: {
    flex: 1,
  },
  statusCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  statusDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  toggleButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  tipsContainer: {
    paddingHorizontal: 16,
  },
  tipCard: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tipIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '30%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    marginTop: 8,
    textAlign: 'center',
  },
});
