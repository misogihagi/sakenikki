import React, { useState, useCallback } from 'react';
import {
  StyleSheet, Text, View, TextInput, Button, Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { DatePickerModal, ja, registerTranslation } from 'react-native-paper-dates';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { onSubmit } from './Write.logic';
import type { FormWrite, Base64String } from './Write.logic';

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  textarea: {
    height: 400,
  },
  image: {
    width: 200,
    height: 200,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function App() {
  registerTranslation('ja', ja);

  const [form, setForm] = useState<FormWrite>({
    name: '',
    description: '',
    impression: '',
    imageData: '' as Base64String,
    price: null,
    when: new Date(),
    location: '',
  });
  const [open, setOpen] = useState(false);

  const onDismissSingle = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirmSingle = useCallback(
    (params) => {
      setOpen(false);
      setForm({ ...form, when: params.date });
    },
    [setOpen, setForm],
  );
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      exif: false,
      selectionLimit: 1,
    });

    if (!result.canceled) {
      setForm({ ...form, imageData: result.assets[0].uri as typeof form.imageData });
    }
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>

        <Text>画像</Text>
        <Button title="画像を選択" onPress={pickImage} />

        {form.imageData ? <Image source={{ uri: form.imageData }} style={styles.image} /> : null}

        <Text>名前</Text>
        <TextInput
          style={styles.input}
          onChangeText={(name) => setForm({ ...form, name })}
          value={form.name}
        />
        <Text>説明</Text>
        <TextInput
          style={styles.textarea}
          onChangeText={(description) => setForm({ ...form, description })}
          value={form.description}
          multiline
          numberOfLines={4}
        />
        <Text>感想</Text>
        <TextInput
          style={styles.textarea}
          onChangeText={(impression) => setForm({ ...form, impression })}
          value={form.impression}
          multiline
          numberOfLines={4}
        />
        <Text>日付</Text>
        <Text>
          {form.when.getFullYear()}
          年
          {form.when.getMonth() + 1}
          月
          {form.when.getDate()}
          日
        </Text>

        <Button onPress={() => setOpen(true)} title="日付を選択" />
        <DatePickerModal
          locale="ja"
          mode="single"
          visible={open}
          onDismiss={onDismissSingle}
          date={form.when}
          onConfirm={onConfirmSingle}
        />

        <Text>料金</Text>
        <TextInput
          style={styles.input}
          onChangeText={(price) => setForm({ ...form, price: Number(price) })}
          value={form.price ? form.price.toString() : ''}
        />
        <Text>場所</Text>
        <TextInput
          style={styles.input}
          onChangeText={(location) => setForm({ ...form, location })}
          value={form.location}
        />
        <Button onPress={() => onSubmit(form)} title="submit" />
      </View>
    </SafeAreaProvider>
  );
}
