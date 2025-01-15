import { useState, ChangeEvent, useCallback } from 'react';
import Textfield from '@atlaskit/textfield';
import DropdownMenu, {
  DropdownItem,
  DropdownItemGroup,
} from '@atlaskit/dropdown-menu';
import { t } from 'i18next';

type ObjectData<T> = T[];

interface AutocompleteTextfieldProps<T> {
  placeholder?: string;
  data: ObjectData<T>;
  keyField?: keyof T;
  onFilter: (filteredData: string) => void;
}

const AutocompleteTextfield = <T extends object>({
  placeholder,
  data,
  keyField,
  onFilter,
}: AutocompleteTextfieldProps<T>) => {
  const [value, setValue] = useState<string>('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<ObjectData<T>>(
    []
  );
  const [isOpen, setIsOpen] = useState(false);

  // 필터링 함수 분리
  const filterData = useCallback(
    (query: string) => {
      if (!query) {
        setFilteredSuggestions([]);
        setIsOpen(false);
        onFilter(''); // 필터링된 데이터가 없으면 빈 문자열을 전달
        return;
      }

      const filtered = data.filter((item) =>
        keyField
          ? (item[keyField] as string)
              .toLowerCase()
              .includes(query.toLowerCase())
          : false
      );

      setFilteredSuggestions(filtered);
      setIsOpen(true);
    },
    [data, keyField]
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setValue(query);
    filterData(query);
  };

  const handleSelect = (selectedValue: T) => {
    const selectedValueString = (
      selectedValue[keyField as keyof T] ?? ''
    ).toString();

    setValue(selectedValueString);
    setFilteredSuggestions([]);
    setIsOpen(false);
    onFilter(selectedValueString);
  };

  return (
    <div>
      <DropdownMenu
        trigger={({ triggerRef, ...props }) => (
          <Textfield
            {...props}
            value={value}
            onChange={handleInputChange}
            placeholder={placeholder || ''}
            isCompact
            ref={triggerRef}
            width={300}
          />
        )}
        appearance='tall'
        shouldRenderToParent
        shouldFitContainer
        isOpen={isOpen}
      >
        <DropdownItemGroup>
          {filteredSuggestions.length === 0 ? (
            <DropdownItem isDisabled>{t('no_filtered_data')}</DropdownItem>
          ) : (
            filteredSuggestions.map((item) => {
              const itemKey =
                typeof item === 'string'
                  ? item
                  : item[keyField as keyof T] ?? '';

              return (
                <DropdownItem
                  key={itemKey as string | number}
                  onClick={() => handleSelect(item)}
                >
                  {String(item[keyField as keyof T] ?? '')}
                </DropdownItem>
              );
            })
          )}
        </DropdownItemGroup>
      </DropdownMenu>
    </div>
  );
};

export default AutocompleteTextfield;
