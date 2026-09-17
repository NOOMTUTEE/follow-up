import ContactsBoard from "@/components/ContactsBoard";

export const metadata = {
  title: "Contacts | Follow-up Board",
};

export default function ContactsPage() {
  return (
    <main className="w-full bg-background pt-16">
      <ContactsBoard />
    </main>
  );
}
