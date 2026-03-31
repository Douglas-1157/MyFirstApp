import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F4F7', // Fundo levemente cinza do Figma
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    justifyContent: 'space-between'
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  cardStats: {
    margin: 20,
    padding: 20,
    borderRadius: 24,
    minHeight: 120, 
    justifyContent: 'center',
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
},
  progressBarBase: {
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    marginVertical: 15,
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#8A2BE2', // Roxo do seu print
    borderRadius: 6,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 15
  },
  inputGroup: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
    marginBottom: 8,
    marginLeft: 5
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 15,
    fontSize: 16,
    color: '#333',
  },
  subtaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  saveBtn: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#5e5ce6',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5
  },

  colorGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  colorOption: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorSelected: {
    borderColor: '#FFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },

  inputMultiline: {
    height: 100,
    textAlignVertical: 'top', 
  },

  
 



});

export default styles;