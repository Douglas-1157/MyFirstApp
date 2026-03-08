import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import { style } from "../style"
import { MaterialIcons, Octicons } from "@expo/vector-icons";

export default function Home() {

  const [searchText, setSearchText] = useState(''); //faz a pesquisa
  const handleSearch = () => {
    console.log('Pesquisando por: ', searchText);
  };

  return (
    <View style={style.boxTop}>
      

      <View style={style.boxInput}>
        <TextInput
          style={style.Input}
          placeholder="O que você procura?"
          value={searchText}
          onChangeText={setSearchText}
          />
    
          <Octicons style={style.Icon}
            name="search"
            size={20}
            color='#6b0dc4'
            onPress={handleSearch}
          />

        
      </View>
    </View>
  );
}

