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
            className="className='w-full py-3 px-4 bg-[#DDDDDD] rounded-md"
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
            className="className='w-full py-3 px-4 bg-[#DDDDDD] rounded-md"
            required
          />
        </label>
      </div>
    </div>
  );
};

export default ContactForm;
