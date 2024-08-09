import { indonesiaCity } from '@/utils/map'
import { ActionMeta } from 'react-select'
import ReactSelect from 'react-select'
import { useDarkMode } from '@/context/DarkModeContext'
import { UseFormSetValue } from 'react-hook-form'
import { OptionCity } from '@/types/city'
import { IndustryData } from '@/types/industry'


interface ChainSelectBoxProps {
  setValue: UseFormSetValue<IndustryData>;
}

const OPTION_CITY = indonesiaCity()


const CitySelectBox: React.FC<ChainSelectBoxProps> = ({ setValue }) => {
  const { darkMode } = useDarkMode();

  const handleChangeCity = (option: OptionCity | null, actionMeta: ActionMeta<OptionCity>) => {
    console.log('Selected option:', option);
    console.log('Action meta:', actionMeta);
    if(option !== null){
      setValue('city', option.value); 
    }
  };


  return (
    <ReactSelect<OptionCity, false>
      className="appearance-none text-xl bg-emerald-100 dark:bg-gray-700 text-black dark:text-white outline-none shadow-none focus:shadow-none"
      aria-labelledby="aria-label"
      isSearchable={true}
      isMulti={false}
      isClearable={true}
      name="city"
      onChange={handleChangeCity}
      options={OPTION_CITY}
      classNamePrefix="car-track"
      styles={{
        control: (base) => ({
          ...base,
          color: '#999',
          background: 'transparent',
          borderColor: '#6b7280',
          fontSize: '1.25rem',
          padding: '1rem 1rem 1rem',
          lineHeight: '1.75rem',
          outline: '2px solid transparent',
          outlineOffset: '2px',
          ":focus": {
            boxShadow: 'none'
          }
        }),
        menuList: (base) => ({
          ...base,
          background: darkMode ? '#374151' : '#d1fae5', //'#22c55e'
        }),
        menu: (base) => ({
          ...base,
          color: '#999',
          background: darkMode ? '#374151' : '#fff'
        }),
        singleValue: (base) => ({
          ...base,
          color: darkMode ? '#fff' : '#6b7280'
        }),

        input: (base) => ({
          ...base,
          color: '#000000',
          ":focus-visible": {
            boxShadow: 'unset'
          },
          "input:focus": {
            boxShadow: 'none'
          }
        })
      }}
    />
  )
}


export default CitySelectBox