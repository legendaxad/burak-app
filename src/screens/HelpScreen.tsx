import { Linking, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useState } from 'react';
import { SymbolView } from 'expo-symbols';

import { Page, PrimaryButton, ScreenHeader, SectionTitle, Surface } from '@/components/AppUI';
import { Brand, Fonts } from '@/constants/theme';

const faqs = [
  { question: 'How do I update a menu item?', answer: 'Open Products, choose a dish, and tap Edit product. You can update its price, description, category, or stock there.' },
  { question: 'How do I move an order forward?', answer: 'Open Orders and choose an order. Paused orders can be started, and orders in process can be marked finished from the order detail screen.' },
  { question: 'How do I mark a dish out of stock?', answer: 'Open the product details and tap Mark unavailable. You can make it available again at any time.' },
  { question: 'Can I change an order after payment?', answer: 'For customer safety, paid orders cannot be cancelled in the app. Please contact the BURAK support team if something needs attention.' },
];

export default function HelpScreen() {
  const [openFaq, setOpenFaq] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [feedback, setFeedback] = useState('');

  const contact = async (url: string, fallback: string) => {
    try {
      await Linking.openURL(url);
      setFeedback(fallback);
    } catch {
      setFeedback('Please contact us at devexuz@gmail.com or +971 4 554 7777.');
    }
  };

  const sendMessage = () => {
    if (!name.trim() || !email.includes('@') || !message.trim()) {
      setFeedback('Add your name, a valid email, and a message so our team can help.');
      return;
    }
    const subject = encodeURIComponent(`BURAK support request from ${name.trim()}`);
    const body = encodeURIComponent(`${message.trim()}\n\nFrom: ${name.trim()} (${email.trim()})`);
    void contact(`mailto:devexuz@gmail.com?subject=${subject}&body=${body}`, 'Your email app is ready with this message.');
  };

  return (
    <Page>
      <ScreenHeader title="How can we help?" subtitle="Find a quick answer or reach the BURAK team." />
      <View style={styles.content}>
        <Surface style={styles.supportHero}>
          <View style={styles.supportIcon}><SymbolView name={{ ios: 'bubble.left.and.bubble.right.fill', android: 'support_agent', web: 'support_agent' }} size={21} tintColor={Brand.goldDeep} /></View>
          <Text style={styles.supportTitle}>We’re here for you</Text>
          <Text style={styles.supportCopy}>Our support team is available 24 hours a day, every day.</Text>
          <View style={styles.contactActions}>
            <Pressable onPress={() => void contact('tel:+97145547777', 'Calling BURAK support…')} accessibilityRole="button" style={({ pressed }) => [styles.contactAction, pressed && styles.pressed]}>
              <SymbolView name={{ ios: 'phone.fill', android: 'call', web: 'call' }} size={17} tintColor={Brand.charcoal} /><Text style={styles.contactActionText}>Call us</Text>
            </Pressable>
            <Pressable onPress={() => void contact('mailto:devexuz@gmail.com', 'Opening an email to BURAK support…')} accessibilityRole="button" style={({ pressed }) => [styles.contactAction, pressed && styles.pressed]}>
              <SymbolView name={{ ios: 'envelope.fill', android: 'mail', web: 'mail' }} size={17} tintColor={Brand.charcoal} /><Text style={styles.contactActionText}>Email us</Text>
            </Pressable>
          </View>
        </Surface>

        <View style={styles.sectionHead}><SectionTitle title="Frequently asked" /></View>
        <Surface style={styles.faqList}>
          {faqs.map((faq, index) => {
            const expanded = openFaq === index;
            return <Pressable key={faq.question} onPress={() => setOpenFaq(expanded ? -1 : index)} accessibilityRole="button" accessibilityState={{ expanded }} style={[styles.faqItem, index > 0 && styles.faqDivider]}>
              <View style={styles.faqQuestionRow}><Text style={styles.faqQuestion}>{faq.question}</Text><SymbolView name={{ ios: expanded ? 'chevron.up' : 'chevron.down', android: expanded ? 'expand_less' : 'expand_more', web: expanded ? 'expand_less' : 'expand_more' }} size={18} tintColor={Brand.muted} /></View>
              {expanded && <Text style={styles.faqAnswer}>{faq.answer}</Text>}
            </Pressable>;
          })}
        </Surface>

        <SectionTitle title="Send us a message" />
        <Surface style={styles.form}>
          <Field label="Your name" value={name} onChangeText={setName} placeholder="Name" />
          <Field label="Email address" value={email} onChangeText={setEmail} placeholder="name@example.com" keyboardType="email-address" />
          <Field label="How can we help?" value={message} onChangeText={setMessage} placeholder="Write your message" multiline />
          <PrimaryButton title="Send message" onPress={sendMessage} icon="paperplane.fill" />
          {feedback ? <Text accessibilityLiveRegion="polite" style={[styles.feedback, feedback.startsWith('Add your name') && styles.feedbackError]}>{feedback}</Text> : null}
        </Surface>

        <Surface style={styles.addressCard}>
          <Text style={styles.addressHeading}>BURAK Restaurant</Text>
          <Text style={styles.addressText}>Downtown, Dubai</Text>
          <Text style={styles.addressText}>+971 4 554 7777 · devexuz@gmail.com</Text>
          <Text style={styles.openingHours}>Open 24 hours</Text>
        </Surface>
      </View>
    </Page>
  );
}

function Field({ label, value, onChangeText, placeholder, multiline = false, keyboardType }: { label: string; value: string; onChangeText: (value: string) => void; placeholder: string; multiline?: boolean; keyboardType?: 'email-address' }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor="#99948C" keyboardType={keyboardType} autoCapitalize={keyboardType === 'email-address' ? 'none' : 'sentences'} multiline={multiline} textAlignVertical={multiline ? 'top' : 'center'} style={[styles.input, multiline && styles.messageInput]} />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, gap: 15 },
  supportHero: { alignItems: 'center', padding: 19, gap: 7 },
  supportIcon: { width: 43, height: 43, borderRadius: 15, backgroundColor: '#F5EBD9', alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
  supportTitle: { color: Brand.text, fontSize: 18, fontWeight: '800', fontFamily: Fonts.serif },
  supportCopy: { color: Brand.muted, fontSize: 12, textAlign: 'center', lineHeight: 18 },
  contactActions: { width: '100%', flexDirection: 'row', gap: 10, marginTop: 8 },
  contactAction: { flex: 1, minHeight: 43, borderRadius: 12, borderWidth: 1, borderColor: Brand.line, backgroundColor: '#FCFBF9', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  contactActionText: { color: Brand.text, fontSize: 12, fontWeight: '700' },
  pressed: { opacity: 0.72 },
  sectionHead: { marginTop: 2 },
  faqList: { paddingVertical: 0, paddingHorizontal: 15 },
  faqItem: { paddingVertical: 15, gap: 8 },
  faqDivider: { borderTopWidth: 1, borderTopColor: Brand.line },
  faqQuestionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  faqQuestion: { flex: 1, color: Brand.text, fontSize: 13, fontWeight: '700', lineHeight: 19 },
  faqAnswer: { color: Brand.muted, fontSize: 12, lineHeight: 19, paddingRight: 22 },
  form: { gap: 13 },
  field: { gap: 7 },
  fieldLabel: { color: Brand.text, fontSize: 12, fontWeight: '700' },
  input: { minHeight: 45, borderWidth: 1, borderColor: Brand.line, borderRadius: 11, paddingHorizontal: 12, paddingVertical: 10, color: Brand.text, fontSize: 13, backgroundColor: '#FCFBF9' },
  messageInput: { minHeight: 94, paddingTop: 12 },
  feedback: { color: Brand.green, fontSize: 12, lineHeight: 18 },
  feedbackError: { color: Brand.red },
  addressCard: { backgroundColor: Brand.charcoal },
  addressHeading: { color: Brand.gold, fontSize: 14, fontWeight: '800', fontFamily: Fonts.serif, marginBottom: 6 },
  addressText: { color: '#E6E0D6', fontSize: 11, lineHeight: 18 },
  openingHours: { color: Brand.gold, fontSize: 11, fontWeight: '700', marginTop: 8 },
});
