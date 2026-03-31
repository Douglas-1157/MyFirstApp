import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions } from 'react-native';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = 62; 

export default function CalendarioUply({ aoSelecionarData }) {
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  
  const diasDoMes = eachDayOfInterval({
    start: startOfMonth(dataSelecionada),
    end: endOfMonth(dataSelecionada),
  });

 
  const hoje = new Date().getDate();
  const initialIndex = hoje > 3 ? hoje - 3 : 0; 

  return (
    <View style={styles.container}>
      
      <View style={styles.headerRow}>
        <Text style={styles.mesTexto}>
          {format(dataSelecionada, 'MMMM', { locale: ptBR })}
        </Text>
        <Text style={styles.textoDireita}>Sem tarefas hoje</Text>
      </View>
      
      <FlatList
        data={diasDoMes}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.toString()}
        initialScrollIndex={initialIndex}
        getItemLayout={(data, index) => (
          { length: ITEM_WIDTH, offset: ITEM_WIDTH * index, index }
        )}
        renderItem={({ item }) => {
          const selecionado = isSameDay(item, dataSelecionada);
          return (
            <TouchableOpacity 
              style={[styles.diaCard, selecionado && styles.diaSelecionado]}
              onPress={() => {
                setDataSelecionada(item);
                aoSelecionarData(item);
              }}>
              <Text style={[styles.diaNome, selecionado && styles.textoEscuro]}>
                
                {format(item, 'eee', { locale: ptBR }).substring(0, 3).toUpperCase()}
              </Text>
              <Text style={[styles.diaNum, selecionado && styles.textoEscuro]}>
                {format(item, 'd')}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#000000', padding: 15, borderRadius: 25 },
  headerRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 15 
  },
  mesTexto: { color: '#fff', fontSize: 18, fontWeight: 'bold', textTransform: 'capitalize' },
  textoDireita: { color: '#888', fontSize: 12 },
  
  diaCard: { 
    alignItems: 'center', 
    justifyContent: 'center',
    paddingVertical: 10, 
    marginHorizontal: 4, 
    borderRadius: 15, 
    width: 54, 
  },
  diaSelecionado: { backgroundColor: '#fff' },
  diaNome: { 
    color: '#888', 
    fontSize: 10, 
    fontWeight: '600',
    marginBottom: -2 
  },
  diaNum: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  textoEscuro: { color: '#000' }
});