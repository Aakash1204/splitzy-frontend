import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function HomeScreen() {
  const handleLogout = () => {
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome,</Text>
            <Text style={styles.appName}>Splitzy</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>+$142.50</Text>
          <Text style={styles.balanceSubtext}>You are owed across 3 groups</Text>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Recent Groups</Text>
        <View style={styles.card}>
          <View style={styles.groupRow}>
            <View style={styles.groupAvatar}>
              <Text style={styles.groupAvatarText}>🏠</Text>
            </View>
            <View style={styles.groupInfo}>
              <Text style={styles.groupName}>Apartment Roomies</Text>
              <Text style={styles.groupMembers}>4 members</Text>
            </View>
            <Text style={styles.positiveAmount}>+$65.00</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.groupRow}>
            <View style={styles.groupAvatar}>
              <Text style={styles.groupAvatarText}>🍕</Text>
            </View>
            <View style={styles.groupInfo}>
              <Text style={styles.groupName}>Weekend Trip</Text>
              <Text style={styles.groupMembers}>6 members</Text>
            </View>
            <Text style={styles.positiveAmount}>+$77.50</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 14,
    color: '#64748B',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  logoutButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  logoutButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#EF4444',
  },
  balanceCard: {
    backgroundColor: '#208AEF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#208AEF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#DBEAFE',
    fontWeight: '500',
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginVertical: 6,
  },
  balanceSubtext: {
    fontSize: 13,
    color: '#BFDBFE',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  groupRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupAvatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  groupAvatarText: {
    fontSize: 20,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  groupMembers: {
    fontSize: 13,
    color: '#64748B',
  },
  positiveAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#10B981',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
});
