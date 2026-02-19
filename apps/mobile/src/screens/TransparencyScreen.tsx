import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const monitoredItems = [
  {
    category: 'Messages & Chats',
    icon: 'chatbubble-ellipses',
    items: ['Text messages (SMS)', 'WhatsApp', 'Instagram DMs', 'Snapchat', 'Discord'],
    description: 'Your messages are scanned for concerning content like cyberbullying or grooming.',
  },
  {
    category: 'Images',
    icon: 'image',
    items: ['Photos received', 'Screenshots', 'Shared images'],
    description: 'Images are checked for inappropriate content.',
  },
  {
    category: 'Apps & Usage',
    icon: 'apps',
    items: ['App usage time', 'Screen time', 'Installed apps'],
    description: 'Your parents can see which apps you use and for how long.',
  },
  {
    category: 'Location',
    icon: 'location',
    items: ['Current location', 'Location history'],
    description: 'Your parents can see where you are for safety.',
  },
];

const alertTypes = [
  { severity: 'Critical', color: '#dc2626', examples: ['Suicidal thoughts', 'Grooming attempts', 'Violence threats'] },
  { severity: 'High', color: '#ea580c', examples: ['Cyberbullying', 'Sexual content', 'Drug references'] },
  { severity: 'Medium', color: '#ca8a04', examples: ['Inappropriate language', 'Unknown contacts'] },
  { severity: 'Low', color: '#6b7280', examples: ['General sentiment tracking'] },
];

export default function TransparencyScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>What's Being Monitored</Text>
          <Text style={styles.headerDescription}>
            SafeGuard helps keep you safe by monitoring your online activity. 
            Here's exactly what your parents can see:
          </Text>
        </View>

        {/* Monitored Categories */}
        <View style={styles.section}>
          {monitoredItems.map((item, index) => (
            <View key={index} style={styles.categoryCard}>
              <View style={styles.categoryHeader}>
                <View style={styles.categoryIcon}>
                  <Ionicons name={item.icon as any} size={24} color="#3b82f6" />
                </View>
                <Text style={styles.categoryTitle}>{item.category}</Text>
              </View>
              <View style={styles.itemsList}>
                {item.items.map((subItem, subIndex) => (
                  <View key={subIndex} style={styles.item}>
                    <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
                    <Text style={styles.itemText}>{subItem}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          ))}
        </View>

        {/* Alert Types */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What Triggers Alerts</Text>
          <Text style={styles.sectionDescription}>
            Your parents get notified when SafeGuard detects:
          </Text>
          
          {alertTypes.map((alert, index) => (
            <View key={index} style={styles.alertCard}>
              <View style={[styles.alertBadge, { backgroundColor: alert.color + '20' }]}>
                <Text style={[styles.alertBadgeText, { color: alert.color }]}>
                  {alert.severity}
                </Text>
              </View>
              <View style={styles.alertExamples}>
                {alert.examples.map((example, exIndex) => (
                  <Text key={exIndex} style={styles.alertExample}>• {example}</Text>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Privacy Note */}
        <View style={styles.privacyCard}>
          <Ionicons name="information-circle" size={24} color="#3b82f6" />
          <Text style={styles.privacyText}>
            SafeGuard is designed to protect you, not spy on you. Your parents 
            want you to be safe online, and this app helps them do that while 
            respecting your privacy.
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
  header: {
    backgroundColor: '#3b82f6',
    padding: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  headerDescription: {
    fontSize: 14,
    color: '#dbeafe',
    lineHeight: 20,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  categoryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#eff6ff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  itemsList: {
    marginBottom: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  itemText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
  },
  description: {
    fontSize: 13,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  alertCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  alertBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  alertBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  alertExamples: {
    marginLeft: 4,
  },
  alertExample: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
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
