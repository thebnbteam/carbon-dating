export const TextInput = ({ title }) => {
  return (
    <>
      <div className="flex flex-col gap-2">
        <label className="text-center text-3xl" htmlFor={title}>
          {title}
        </label>
        <input
          type={title === "email" ? "email" : "text"}
          name={title}
          required
          className="bg-[#fbb5d7] border border-solid border-white p-2 rounded-md"
        />
      </div>
    </>
  );
};
