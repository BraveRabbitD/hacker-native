import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

type Feedback = {
  rating: number | null;
  comment?: string;
};

const STORAGE_KEY = 'feedback:v1';

export const FeedbackForm = () => {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed: Feedback = JSON.parse(raw);
          setRating(parsed.rating ?? null);
          setComment(parsed.comment ?? '');
        }
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  const validate = () => rating !== null && rating >= 1 && rating <= 5;

  const onSubmit = async () => {
    if (!validate()) {
      setStatus('rating-required');
      return;
    }

    const payload: Feedback = { rating, comment };
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      setStatus('saved');
    } catch (e) {
      setStatus('error');
    }
  };

  return (
    <View>
      <Text>Rating (1-5)</Text>
      <TextInput
        testID="rating-input"
        value={rating === null ? '' : String(rating)}
        onChangeText={(t) => setRating(t === '' ? null : Number(t))}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text>Comment (optional)</Text>
      <TextInput
        testID="comment-input"
        value={comment}
        onChangeText={setComment}
        style={styles.input}
      />

      <Button title="Submit" onPress={onSubmit} testID="submit-button" />

      {status === 'rating-required' && (
        <Text testID="err-rating">Rating is required</Text>
      )}
      {status === 'saved' && <Text testID="saved">Saved</Text>}
      {status === 'error' && <Text testID="err-save">Save failed</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 8,
    marginBottom: 12,
  },
});

export default FeedbackForm;
