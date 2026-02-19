import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

const scoreData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [{
    data: [85, 88, 92, 90, 87, 94, 95],
  }],
};

const factors = [
  { name: 'Positive Messages', score: 95, icon: 'happy', color: '#22c55e' },
  { name: 'Healthy Contacts', score: 88, icon: 'people', color: '#3b82f6' },
  { name: 'Appropriate Content', score: 92, icon: 'checkmark-circle', color: '#8b5cf6' },
  { name: 'Safe Hours', score: 85, icon: 'time', color: '#f59e0b' },
];

const tips = [
  'Keep being positive in your messages!',
  'You\'re doing great with online safety.',
  'Try to limit late-night screen time.',
  'Remember to be kind to others online.',
];

export default function SafetyScoreScreen() {
  const overallScore = 92;

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#22c55e';
    if (score >= 70) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return 'Excellent! You\'re staying very safe online.';
    if (score >= 70) return 'Good job! There\'s room for small improvements.';
    return 'Let\'s work together to improve your online safety.';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Overall Score */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreHeader}>
            <Text style={styles.scoreTitle}>Your Safety Score</Text>
            <Ionicons name="shield-checkmark" size={32} color="#3b82f6" />
          </View>
          
          <View style={styles.scoreCircle}>
            <Text style={[styles.scoreNumber, { color: getScoreColor(overallScore) }]}>
              {overallScore}
            </Text>
            <Text style={styles.scoreLabel}>out of 100</Text>
          </View>
          
          <Text style={styles.scoreMessage}>
            {getScoreMessage(overallScore)}
          </Text>
        </View>

        {/* Score Trend */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>7-Day Trend</Text>
          <LineChart
            data={scoreData}
            width={width - 64}
            height={180}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: '#3b82f6',
              },
            }}
            bezier
            style={styles.chart}
          />
        </View>

        {/* Score Factors */}
        <View style={styles.factorsCard}>
          <Text style={styles.factorsTitle}>Score Breakdown</Text>
          {factors.map((factor, index) => (
            <View key={index} style={styles.factorRow}>
              <View style={styles.factorLeft}>
                <View style={[styles.factorIcon, { backgroundColor: factor.color + '20' }]}>
                  <Ionicons name={factor.icon as any} size={20} color={factor.color} />
                </View>
                <Text style={styles.factorName}>{factor.name}</Text>
              </View>
              <View style={styles.factorRight}>
                <View style={[styles.factorBar, { width: `${factor.score}%`, backgroundColor: factor.color }]} />
                <Text style={[styles.factorScore, { color: factor.color }]}>{factor.score}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Tips to Improve</Text>
          {tips.map((tip, index) => (
            <View key={index} style={styles.tipRow}>
              <Ionicons name="bulb" size={20} color="#f59e0b" />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>

        {/* Recent Activity */}
        <View style={styles.activityCard}>
          <Text style={styles.activityTitle}>Recent Activity</Text>
          {[
            { action: 'Sent a safe message', time: '2 hours ago', positive: true },
            { action: 'Added a new contact', time: '5 hours ago', positive: true },
            { action: 'Used app within safe hours', time: 'Yesterday', positive: true },
          ].map((item, index) => (
            <View key={index} style={styles.activityRow}>
              <Ionicons
                name={item.positive ? 'checkmark-circle' : 'information-circle'}
                size={20}
                color={item.positive ? '#22c55e' : '#f59e0b'}
              />
              <View style={styles.activityContent}>
                <Text style={styles.activityAction}>{item.action}</Text>
                <Text style={styles.activityTime}>{item.time}</Text>
              </View>
            </View>
          ))}
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
  scoreCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginRight: 8,
  },
  scoreCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: '700',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  scoreMessage: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
  },
  chartCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  chart: {
    borderRadius: 12,
    marginVertical: 8,
  },
  factorsCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  factorsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  factorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  factorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  factorIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  factorName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  factorRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  factorBar: {
    height: 8,
    borderRadius: 4,
    marginRight: 8,
    maxWidth: 80,
  },
  factorScore: {
    fontSize: 14,
    fontWeight: '700',
    width: 28,
  },
  tipsCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    marginLeft: 12,
    lineHeight: 20,
  },
  activityCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityContent: {
    marginLeft: 12,
  },
  activityAction: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  activityTime: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
});
