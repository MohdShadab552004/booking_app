type Props = {
  agreed: boolean;
  setAgreed: (v: boolean) => void;
};

const AgreementCheckbox = ({ agreed, setAgreed }: Props) => {
  return (
    <div className="flex items-center space-x-3 mt-1">
      <input
        id="agree"
        type="checkbox"
        checked={agreed}
        onChange={(e) => setAgreed(e.target.checked)}
        className="h-4 w-4 rounded border-gray-300 text-yellow-400 focus:ring-yellow-400"
      />
      <label htmlFor="agree" className="text-sm text-gray-600">
        I agree to the terms and safety policy
      </label>
    </div>
  );
};

export default AgreementCheckbox;
