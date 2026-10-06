import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import api from '../src/services/api';

export default function HomeScreen({ navigation }) {
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    lowStockCount: 0,
    recentActivities: [],
  });

  const loadDashboard = async () => {
    try {
      const response = await api.get('/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.log('Erro ao carregar Dashboard:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [])
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Bem-vindo</Text>
          <Text style={styles.userName}>Sistema de Estoque</Text>
        </View>
        <TouchableOpacity style={styles.notification}>
          <Ionicons name="notifications-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Produtos em Estoque</Text>
        <Text style={styles.balanceValue}>{dashboardData.totalProdutos}</Text>
        <View style={styles.balanceFooter}>
          <Ionicons name="trending-up" size={18} color="#1a9e72" />
          <Text style={styles.balanceGrowth}>Atualizado com o BD</Text>
        </View>
      </View>

      <View style={styles.cardsContainer}>
        <View style={styles.smallCard}>
          <View style={styles.iconBlue}>
            <Ionicons name="cube" size={24} color="#1a6fa8" />
          </View>
          <Text style={styles.cardNumber}>{dashboardData.totalProdutos}</Text>
          <Text style={styles.cardLabel}>Unidades Totais</Text>
        </View>

        <View style={styles.smallCard}>
          <View style={styles.iconRed}>
            <Ionicons name="alert-circle" size={24} color="#d94040" />
          </View>
          <Text style={styles.cardNumber}>{dashboardData.lowStockCount}</Text>
          <Text style={styles.cardLabel}>Estoque Baixo</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Operações</Text>

      <TouchableOpacity style={styles.actionButtonBlue} onPress={() => navigation.navigate('Produtos')}>
        <View style={styles.buttonContent}>
          <Ionicons name="cube-outline" size={26} color="#1a6fa8" />
          <View>
            <Text style={styles.buttonTitle}>Produtos</Text>
            <Text style={styles.buttonSubtitle}>Visualizar estoque completo</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={22} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButtonGreen} onPress={() => navigation.navigate('Entrada')}>
        <View style={styles.buttonContent}>
          <Ionicons name="arrow-down-circle-outline" size={26} color="#1a9e72" />
          <View>
            <Text style={styles.buttonTitle}>Entrada de Estoque</Text>
            <Text style={styles.buttonSubtitle}>Registrar novos produtos</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={22} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButtonRed} onPress={() => navigation.navigate('Saída')}>
        <View style={styles.buttonContent}>
          <Ionicons name="arrow-up-circle-outline" size={26} color="#d94040" />
          <View>
            <Text style={styles.buttonTitle}>Saída de Estoque</Text>
            <Text style={styles.buttonSubtitle}>Registrar retirada</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={22} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Atividades Recentes</Text>

      {dashboardData?.movimentacoes?.map((item) => (
        <View key={item.id} style={styles.activityCard}>
          <Ionicons
            name={item.type === 'Entrada' ? 'checkmark-circle' : 'remove-circle'}
            size={22}
            color={item.type === 'Entrada' ? '#1a9e72' : '#d94040'}
          />
          <Text style={styles.activityText}>
            {item.type} de {item.quantity} {item.product}
          </Text>
        </View>
      ))}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7fa',
    paddingHorizontal: 20,
  },

  header: {
    marginTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  welcome: {
    color: '#5a6b7d',
    fontSize: 15,
  },

  userName: {
    color: '#1a2332',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 3,
  },

  notification: {
    width: 50,
    height: 50,
    backgroundColor: '#1a6fa8',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

  balanceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 30,
    padding: 25,
    marginTop: 30,
  },

  balanceLabel: {
    color: '#0c3d61',
    fontSize: 16,
  },

  balanceValue: {
    color: '#1a2332',
    fontSize: 42,
    fontWeight: 'bold',
    marginTop: 10,
  },

  balanceFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },

  balanceGrowth: {
    color: '#1a9e72',
    marginLeft: 6,
    fontWeight: '600',
  },

  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
  },

  smallCard: {
    backgroundColor: '#ffffff',
    width: '48%',
    borderRadius: 22,
    padding: 20,
  },

  iconBlue: {
    width: 50,
    height: 50,
    backgroundColor: '#e8f3fb',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconRed: {
    width: 50,
    height: 50,
    backgroundColor: '#fdecea',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cardNumber: {
    color: '#1a2332',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 15,
  },

  cardLabel: {
    color: '#5a6b7d',
    marginTop: 5,
  },

  sectionTitle: {
    color: '#1a2332',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 35,
    marginBottom: 18,
  },

  actionButtonBlue: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  actionButtonGreen: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  actionButtonRed: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },

  buttonTitle: {
    color: '#1a2332',
    fontSize: 18,
    fontWeight: 'bold',
  },

  buttonSubtitle: {
    color: '#5a6b7d',
    marginTop: 3,
    fontSize: 13,
  },

  activityCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#d8e3ed',
  },

  activityText: {
    color: '#1a2332',
    fontSize: 15,
  },
});
