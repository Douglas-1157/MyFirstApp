import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ITEM_WIDTH = 62; 

export default function CalendarioUply({ aoSelecionarData, datasMarcadas }) {
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const flatListRef = useRef(null);

  const diasDoMes = eachDayOfInterval({
    start: startOfMonth(dataSelecionada),
    end: endOfMonth(dataSelecionada),
  });

  // CORREÇÃO DO UNDEFINED:
  // Usamos o operador ?? 0 para garantir que se for undefined, mostre 0.
  const dataChaveSelecionada = format(dataSelecionada, 'yyyy-MM-dd');
  const tarefasNoDia = datasMarcadas?.[dataChaveSelecionada]?.quantidade ?? 0;

  useEffect(() => {
    const hoje = new Date().getDate();
    const index = hoje > 3 ? hoje - 3 : 0;
    
    setTimeout(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({ index, animated: true, viewPosition: 0 });
      }
    }, 500);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.mesTexto}>
          {format(dataSelecionada, 'MMMM', { locale: ptBR })}
        </Text>
        
        <View style={styles.badgeContador}>
          <Text style={styles.textoDireita}>
            {tarefasNoDia === 0 ? 'Sem tarefas' : `${tarefasNoDia} ${tarefasNoDia === 1 ? 'tarefa' : 'tarefas'}`}
          </Text>
        </View>
      </View>
      
      <FlatList
        ref={flatListRef}
        data={diasDoMes}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.toISOString()}
        getItemLayout={(data, index) => (
          { length: ITEM_WIDTH, offset: ITEM_WIDTH * index, index }
        )}
        onScrollToIndexFailed={() => {}}
        renderItem={({ item }) => {
          const selecionado = isSameDay(item, dataSelecionada);
          const dataChave = format(item, 'yyyy-MM-dd');
          
          // Verifica se existem tarefas para a barra indicadora
          const infoTarefa = datasMarcadas?.[dataChave];
          const possuiTarefa = (infoTarefa?.quantidade ?? 0) > 0;

          return (
            <TouchableOpacity 
              activeOpacity={0.7}
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

              {possuiTarefa && (
                <View style={[
                  styles.barraIndicadora, 
                  { backgroundColor: selecionado ? '#000' : (infoTarefa.cor || '#6b0dc4') }
                ]} />
              )}
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
  badgeContador: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12
  },
  textoDireita: { color: '#FFF', fontSize: 11, fontWeight: '600' },
  diaCard: { 
    alignItems: 'center', 
    justifyContent: 'center',
    paddingVertical: 10, 
    marginHorizontal: 4, 
    borderRadius: 15, 
    width: 54, 
    height: 75 
  },
  diaSelecionado: { backgroundColor: '#fff' },
  diaNome: { color: '#888', fontSize: 10, fontWeight: '600', marginBottom: -2 },
  diaNum: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  textoEscuro: { color: '#000' },
  barraIndicadora: {
    width: 18,
    height: 3,
    borderRadius: 2,
    position: 'absolute',
    bottom: 10
  }
});