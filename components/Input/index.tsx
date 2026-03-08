import React, { forwardRef, Fragment, Ref } from "react";
import { FontAwesome, MaterialIcons, Octicons } from '@expo/vector-icons';
import { Text, View, Image, TextInput, TouchableOpacity, Alert, ActivityIndicator, TextInputProps } from 'react-native';
import { style } from '../../components/Input/style'
import { themas } from "@/global/themes.";

type IconComponent = React.ComponentType<React.ComponentProps<typeof MaterialIcons>> | //significa q o iconcomponent e do tipo material icons, ou ffontawesome e por ai vai....
    React.ComponentType<React.ComponentProps<typeof FontAwesome>> |
    React.ComponentType<React.ComponentProps<typeof Octicons>>


type Props = TextInputProps & {
    IconLeft?: IconComponent,
    IconRight?: IconComponent,
    iconLeftName?: string,
    iconRightName?: string,
    title?: string,
    onIconLeftPress?: () => void, //isso passa uma função que retorna uma ação
    onIconRightPress?: () => void //isso passa uma função que retorna uma ação

}

export const Input = forwardRef((Props: Props, ref: Ref<TextInput> | null) => {

    const { IconLeft, IconRight, iconLeftName, iconRightName, title, onIconLeftPress, onIconRightPress, ...rest } = Props
    
    const calculateSizeWidth = () =>{
        if(IconLeft && IconRight){
            return '80%'
        }else if(IconLeft || IconRight) {
            return '90%'
        }else {
            return '100%'
        }

    }

     const calculateSizePaddingLeft= () =>{
        if(IconLeft && IconRight){
            return 0
        }else if(IconLeft || IconRight) {
            return 10
        }else {
            return 20
        }

    }




    return (
        <Fragment>
            <Text style={style.titleInput}>{title}</Text>
            <View style={[style.boxInput, { paddingLeft: calculateSizePaddingLeft()}]}>
    
                {IconLeft && iconLeftName && (
                    <TouchableOpacity>
                        <IconLeft name={iconLeftName as any} size={20} color={'#6b0dc4'} style={style.Icon} />
                    </TouchableOpacity>

                )}
                <TextInput
                    style={[style.Input, {width:calculateSizeWidth()}]

                    }
                    // value={email}
                    // onChangeText={setEmail}
                    placeholder="Usuario ou Email"
                    {...rest}
                />
                {IconRight && iconRightName && (
                    <TouchableOpacity>
                        <IconRight name={iconRightName as any} size={20} color={'#6b0dc4'} style={style.Icon} />
                    </TouchableOpacity>

                )}
            </View>
        </Fragment>

    )

})