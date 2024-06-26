export const Balance = ({ value }) => {
  const roundedOff = Math.round(value * 100) / 100
  return (
    <div className="flex">
      <div className="font-bold text-lg">Your balance</div>
      <div className="font-semibold ml-4 text-lg">Rs {roundedOff}</div>
    </div>
  );
};
