import { Dimensions, StyleSheet } from "react-native";

const { width: screenWidth } = Dimensions.get('window');

export const style = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  boxTop: {
    width: '100%',
    paddingTop: 10,
    paddingHorizontal: 25,
    paddingBottom: 25,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  textUser: {
    flexDirection: 'column',
  },

  Text: {
    color: "#888",
    fontSize: 18,
    fontWeight: '500',
  },

  Usuario: {
    color: "#000",
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 0,
  },

  userFoto: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    borderWidth: 2,
    borderColor: '#6b0dc4',
  },


  Input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#000',
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },

  cardVazio: {
    width: '90%',
    height: 190,
    alignSelf: 'center',
    backgroundColor: '#FFF',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginTop: 30
  },

  cardVazioText: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: '700',
    color: '#6b0dc4',
  },

  cardVazioSub: {
    fontSize: 14,
    color: '#6b0dc4',
    marginTop: 5,
  },

  fab: {
    position: 'absolute',
    bottom: 30,
    right: 25,
    width: 64,
    height: 64,
    borderRadius: 32, 
    // Sombra
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    overflow: 'hidden', 
  },

  fabGradient: {
    flex: 1,
    width: '100%',
    height: '100%', 
    justifyContent: 'center',
    alignItems: 'center',
  },

  tituloSecao: {
    fontSize: 22,
    fontWeight: '800',
    color: '#212121',
    marginBottom: -15
  },
  iconBackgroundVazio: {
    backgroundColor: '#f0f0ff',
    padding: 20,
    borderRadius: 50,
    marginBottom: 10
  },





});

export default style;