import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../src/services/api';

export default function ExitScreen({ navigation }) {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    api.get('/products/1').then(res => setProduct(res.data)).catch(console.log);
  }, []);

  const handleConfirmExit = async () => {
    const qtyNum = Number(quantity);
    if (!quantity || isNaN(qtyNum) || qtyNum <= 0) {
      Alert.alert('Erro', 'Insira uma quantidade válida.');
      return;
    }

    if (product && qtyNum > product.stock) {
      Alert.alert('Erro', 'Quantidade solicitada é maior que o estoque atual.');
      return;
    }

    try {
      await api.post('/stock/move', {
        productId: product.id,
        type: 'Saída',
        quantity: qtyNum,
      });

      Alert.alert('Sucesso', 'Saída realizada com sucesso!', [
        { text: 'OK', onPress: () => navigation.navigate('Home') },
      ]);
    } catch (error) {
      Alert.alert('Erro', error.response?.data?.message || 'Erro ao registrar saída.');
    }
  };

  const remainingStock = (product?.stock || 0) - Number(quantity || 0);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Saída de Estoque</Text>

      <TouchableOpacity style={styles.qrButton}>
        <Ionicons name="qr-code-outline" size={28} color="#FFFFFF" />
        <Text style={styles.qrText}>Escanear Produto</Text>
      </TouchableOpacity>

      {product && (
        <View style={styles.productCard}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.stock}>Estoque Atual: {product.stock}</Text>
        </View>
      )}

      <Text style={styles.label}>Quantidade de Saída</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite a quantidade"
        placeholderTextColor="#8FA0B3"
        keyboardType="numeric"
        value={quantity}
        onChangeText={setQuantity}
      />

      <View style={styles.resultCard}>
        <Text style={styles.resultText}>Estoque Restante</Text>
        <Text style={styles.resultValue}>
          {remainingStock < 0 ? 0 : remainingStock}
        </Text>
      </View>

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmExit}>
        <Ionicons name="remove-circle" size={24} color="#FFFFFF" />
        <Text style={styles.confirmText}>Confirmar Saída</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Fundo principal: --fundo
  container: {
    flex: 1,
    backgroundColor: '#F4F7FA',
    padding: 20,
  },

  // Texto principal: --texto
  title: {
    color: '#1A2332',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 50,
    marginBottom: 30,
  },

  // Ação principal usando azul médico
  qrButton: {
    backgroundColor: '#1A6FA8',
    height: 70,
    borderRadius: 22,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },

  qrText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Card branco clínico
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 25,
    marginTop: 30,
    borderWidth: 1,
    borderColor: '#D8E3ED',
  },

  productName: {
    color: '#1A2332',
    fontSize: 22,
    fontWeight: 'bold',
  },

  // Verde saúde
  stock: {
    color: '#1A9E72',
    marginTop: 10,
    fontWeight: 'bold',
  },

  label: {
    color: '#1A2332',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 35,
    marginBottom: 15,
  },

  // Campo de entrada
  input: {
    backgroundColor: '#EDF1F5',
    height: 65,
    borderRadius: 18,
    paddingHorizontal: 20,
    color: '#1A2332',
    fontSize: 18,
    borderWidth: 1.5,
    borderColor: '#D8E3ED',
  },

  // Alerta suave usando --vermelho-claro
  resultCard: {
    backgroundColor: '#FDECEA',
    borderRadius: 22,
    padding: 25,
    marginTop: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3C8C5',
  },

  resultText: {
    color: '#8B1A1A',
    fontSize: 16,
  },

  resultValue: {
    color: '#D94040',
    fontSize: 40,
    fontWeight: 'bold',
    marginTop: 10,
  },

  // Ação de saída usando vermelho clínico
  confirmButton: {
    backgroundColor: '#D94040',
    height: 65,
    borderRadius: 22,
    marginTop: 35,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },

  confirmText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
