import DropdownMenu, {
  DropdownItem,
  DropdownItemGroup,
} from '@atlaskit/dropdown-menu';

interface DropdownOptionItemType {
  key: string;
  label: string;
}

interface DropdownProps {
  options: DropdownOptionItemType[]; // 외부에서 전달되는 데이터
  selectedKey: string; // 외부에서 선택된 key
  onChange: (key: string) => void; // 외부에서 전달되는 onChange 콜백
}

const Dropdown = ({ options, selectedKey, onChange }: DropdownProps) => {
  const handleItemClick = (key: string) => {
    onChange(key); // 외부로 선택된 key를 전달
  };

  // key에 맞는 label을 반환하는 함수
  const getLabelByKey = (key: string) => {
    const selectedOption = options.find((option) => option.key === key);
    return selectedOption ? selectedOption.label : ''; // key에 맞는 label 반환
  };

  return (
    <DropdownMenu trigger={getLabelByKey(selectedKey)}>
      <DropdownItemGroup>
        {options.map((option) => (
          <DropdownItem
            key={option.key}
            isSelected={option.key === selectedKey} // 선택된 항목 표시
            onClick={() => handleItemClick(option.key)}
          >
            {option.label}
          </DropdownItem>
        ))}
      </DropdownItemGroup>
    </DropdownMenu>
  );
};

export default Dropdown;
