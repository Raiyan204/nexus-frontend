import ContactDetailScreen from '../../screens/ContactDetailScreen';
import { useLocalSearchParams } from 'expo-router';

export default function ContactRoute() {
  const { id } = useLocalSearchParams();
  return <ContactDetailScreen contactId={id as string} />;
}
