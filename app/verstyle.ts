import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  
  // Card de Progresso (cite: image_6248e1.png)
  cardProgresso: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    marginTop: 10,
    marginBottom: 15,
    // Sombras para iOS e Android
    shadowColor: "#a382ec",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  // Grid de Resumo (Onde fica "5 tarefas | 3 concluídas") (cite: image_6248e1.png)
  gridResumo: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 24,
    paddingVertical: 25,
    paddingHorizontal: 15,
    marginBottom: 25,
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  boxTotalTasks: {
    alignItems: 'center',
    flex: 1,
  },
  boxDetalhesTasks: {
    flex: 1,
    paddingLeft: 20,
  },

  // Estilo das Subtarefas (cite: image_6248e1.png)
  inputGroup: {
    marginTop: 10,
  },
  label: {
    marginBottom: 15,
  },
  subtaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 18,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },

  // Botão de Editar (FAB) (cite: conversa anterior)
  fab: {
    position: 'absolute',
    right: 25,
    bottom: 35,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    // Sombra mais forte para o botão se destacar (cite: image_6248e1.png)
    shadowColor: "#6b0dc4",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },




});

export default styles;