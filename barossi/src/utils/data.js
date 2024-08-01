export const customStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: "transparent",
    border: "1px solid #borda-card", // Certifique-se de substituir $borda-card pelo valor hexadecimal ou pela variável correta
    width: "100%",
    height: "auto",
    outline: "none",
    fontSize: "16px",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#borda-card",
    },
    color: "#000",
  }),
  valueContainer: (provided, state) => ({
    ...provided,
    padding: state.isMulti ? "0" : provided.padding,
    paddingLeft: "10px",
  }),
  container: (provided) => ({
    ...provided,
    width: "100%",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#0052CC"
      : state.isFocused
      ? "#E3E3E3"
      : "white",
    color: state.isSelected ? "white" : "black",
    "&:hover": {
      backgroundColor: "#E3E3E3",
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#000",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#666666",
  }),
  menu: (provided) => ({
    ...provided,
    marginTop: 0,
  }),
  menuList: (provided) => ({
    ...provided,
    padding: 0,
  }),
};

export const modalidades = [
  { value: "pilates", label: "3x Pilates", mensalidade: "200,00" },
  { value: "pilates", label: "2x Pilates", mensalidade: "150,00" },
  { value: "karate", label: "3x Karate", mensalidade: "150,00" },
  { value: "karate", label: "2x Karate", mensalidade: "130,00" },
  { value: "taekwondo", label: "Taekwondo", mensalidade: "130,00" },
  { value: "boxeChines", label: "Boxe Chinês", mensalidade: "100,00" },
  { value: "kungFu", label: "Kung Fu", mensalidade: "160,00" },
  {
    value: "ginasticaRitmica",
    label: "Ginastica Ritmica",
    mensalidade: "180,00",
  },
  { value: "jiuJitsu", label: "Jiu-Jítsu", mensalidade: "95,00" },
];

export const maiorDeIdadeData = [
  { value: "sim", label: "Sim" },
  { value: "nao", label: "Não" },
];