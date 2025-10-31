type Props = {
  fullName: string;
  setFullName: (s: string) => void;
  email: string;
  setEmail: (s: string) => void;
};

const ContactForm = ({ fullName, setFullName, email, setEmail }: Props) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex flex-col">
          <span className="text-sm text-gray-600 mb-2">Full name</span>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your name"
            className="w-full rounded-md px-3 py-3 bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm text-gray-600 mb-2">Email</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            type="email"
            className="w-full rounded-md px-3 py-3 bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />
        </label>
      </div>
    </div>
  );
};

export default ContactForm;
