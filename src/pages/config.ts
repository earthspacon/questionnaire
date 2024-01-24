export type FormField = {
  type: 'text' | 'number' | 'select' | 'multiple-input' | 'multiple-checkbox'
  name: string
  label: string
  value?: string | number | string[]
  required: boolean
  placeholder?: string
  helperText?: string
  options?: { value: string; label: string }[]
}

export const formFieldsMock: FormField[] = [
  {
    type: 'text',
    name: 'name',
    label: 'Имя',
    required: true,
    placeholder: 'Введите ваше имя',
  },
  {
    type: 'number',
    name: 'age',
    label: 'Возраст',
    required: true,
  },
  {
    type: 'select',
    name: 'family_status',
    label: 'Семейное положение',
    value: 'single',
    options: [
      { value: 'married', label: 'Женат/Замужем' },
      { value: 'single', label: 'Не женат/Не замужем' },
    ],
    required: true,
  },
  {
    type: 'multiple-input',
    name: 'university',
    label: 'ВУЗ',
    required: false,
    placeholder: 'Например, ВолгГАСУ',
    helperText: 'Укажите учебные заведения, в которых вы учились',
  },
  {
    type: 'select',
    name: 'birthplace',
    label: 'Место рождения',
    value: 'moscow',
    options: [
      { value: 'any', label: 'Не важно' },
      { value: 'moscow', label: 'Москва' },
      { value: 'piter', label: 'Санкт-Петербург' },
      { value: 'volgograd', label: 'Волгоград' },
    ],
    required: false,
  },
  {
    type: 'multiple-checkbox',
    name: 'skills',
    label: 'Навыки',
    required: false,
    helperText: 'Отметьте ваши навыки',
    options: [
      {
        label: 'Общение',
        value: 'communication',
      },
      {
        label: 'Знание иностранных языков',
        value: 'languages',
      },
      {
        label: 'Готовка',
        value: 'cooking',
      },
      {
        label: 'Бег с препятствиями',
        value: 'running-with-obstacles',
      },
      {
        label: 'Быстрое чтение',
        value: 'fast-reading',
      },
      {
        label: 'Бокс',
        value: 'boxing',
      },
      {
        label: 'Пение',
        value: 'singing',
      },
      {
        label: 'Программирование',
        value: 'programming',
      },
      {
        label: 'Вождение',
        value: 'driving',
      },
    ],
  },
]
