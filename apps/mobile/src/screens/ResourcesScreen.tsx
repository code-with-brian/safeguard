import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const crisisResources = [
  {
    name: 'Crisis Text Line',
    description: 'Text HOME to 741741 for free crisis support',
    phone: '741741',
    icon: 'chatbubble',
    color: '#22c55e',
  },
  {
    name: '988 Suicide & Crisis Lifeline',
    description: 'Call or text 988 for immediate help',
    phone: '988',
    icon: 'call',
    color: '#3b82f6',
  },
  {
    name: 'The Trevor Project',
    description: 'LGBTQ+ crisis support: 1-866-488-7386',
    phone: '18664887386',
    icon: 'heart',
    color: '#8b5cf6',
  },
];

const educationalResources = [
  {
    title: 'Online Safety Tips',
    description: 'Learn how to stay safe on social media',
    icon: 'shield-checkmark',
  },
  {
    title: 'Dealing with Cyberbullying',
    description: 'What to do if you\'re being bullied online',
    icon: 'people',
  },
  {
    title: 'Digital Wellness',
    description: 'Healthy habits for screen time',
    icon: 'phone-portrait',
  },
  {
    title: 'Talking to Parents',
    description: 'How to discuss difficult topics',
    icon: 'chatbubbles',
  },
];

const appFeatures = [
  {
    title: 'Report a Concern',
    description: 'Tell your parents about something that worried you',
    action: 'report',
    icon: 'warning',
    color: '#f59e0b',
  },
  {
    title: 'Request a Break',
    description: 'Ask your parents for some offline time',
    action: 'break',
    icon: 'pause-circle',
    color: '#3b82f6',
  },
  {
    title: 'Talk to Parent',
    description: 'Start a conversation about your monitoring',
    action: 'talk',
    icon: 'chatbubble-ellipses',
    color: '#22c55e',
  },
];

export default function ResourcesScreen() {
  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleFeature = (action: string) => {
    // In a real app, this would send a message to the parent
    alert(`This would notify your parent that you want to ${action}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Crisis Resources */}
        <View style={styles.crisisSection}>
          <View style={styles.crisisHeader}>
            <Ionicons name="alert-circle" size={24} color="#dc2626" />
            <Text style={styles.crisisTitle}>Need Help Now?</Text>
          </View>
          <Text style={styles.crisisSubtitle}>
            If you\'re in crisis, reach out to these resources:
          </Text>
          
          {crisisResources.map((resource, index) => (
            <TouchableOpacity
              key={index}
              style={styles.crisisCard}
              onPress={() => handleCall(resource.phone)}
            >
              <View style={[styles.crisisIcon, { backgroundColor: resource.color + '20' }]}>
                <Ionicons name={resource.icon as any} size={24} color={resource.color} />
              </View>
              <View style={styles.crisisContent}>
                <Text style={styles.crisisName}>{resource.name}</Text>
                <Text style={styles.crisisDescription}>{resource.description}</Text>
              </View>
              <Ionicons name="call" size={20} color={resource.color} />
            </TouchableOpacity>
          ))}
        </View>

        {/* App Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          {appFeatures.map((feature, index) => (
            <TouchableOpacity
              key={index}
              style={styles.featureCard}
              onPress={() => handleFeature(feature.action)}
            >
              <View style={[styles.featureIcon, { backgroundColor: feature.color + '20' }]}>
                <Ionicons name={feature.icon as any} size={24} color={feature.color} />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Educational Resources */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Learn More</Text>
          {educationalResources.map((resource, index) => (
            <TouchableOpacity key={index} style={styles.resourceCard}>
              <View style={styles.resourceIcon}>
                <Ionicons name={resource.icon as any} size={24} color="#3b82f6" />
              </View>
              <View style={styles.resourceContent}>
                <Text style={styles.resourceTitle}>{resource.title}</Text>
                <Text style={styles.resourceDescription}>{resource.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Privacy Note */}
        <View style={styles.privacyCard}>
          <Ionicons name="lock-closed" size={24} color="#3b82f6" />
          <Text style={styles.privacyText}>
            Your privacy matters. SafeGuard only shares concerning activity with 
            your parents. Normal conversations and activities remain private.
          </Text>
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
  crisisSection: {
    backgroundColor: '#fef2f2',
    padding: 20,
    margin: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  crisisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  crisisTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#dc2626',
    marginLeft: 8,
  },
  crisisSubtitle: {
    fontSize: 14,
    color: '#991b1b',
    marginBottom: 16,
  },
  crisisCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  crisisIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crisisContent: {
    flex: 1,
    marginLeft: 12,
  },
  crisisName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  crisisDescription: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureContent: {
    flex: 1,
    marginLeft: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  featureDescription: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  resourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  resourceIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resourceContent: {
    flex: 1,
    marginLeft: 12,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  resourceDescription: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  privacyCard: {
    backgroundColor: '#eff6ff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  privacyText: {
    flex: 1,
    fontSize: 14,
    color: '#1e40af',
    marginLeft: 12,
    lineHeight: 20,
  },
});
