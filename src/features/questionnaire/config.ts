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
    type: 'text',
    name: 'surname',
    label: 'Фамилия',
    required: true,
    placeholder: 'Введите вашу фамилию',
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
    type: 'multiple-checkbox',
    label: 'Владение иностранными языками',
    name: 'languages',
    required: true,
    helperText: 'Отметьте языки, которыми вы владеете',
    options: [
      {
        label: 'Английский',
        value: 'english',
      },
      {
        label: 'Немецкий',
        value: 'german',
      },
      {
        label: 'Французский',
        value: 'french',
      },
      {
        label: 'Испанский',
        value: 'spanish',
      },
      {
        label: 'Итальянский',
        value: 'italian',
      },
      {
        label: 'Китайский',
        value: 'chinese',
      },
    ],
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
    type: 'select',
    name: 'current_city',
    label: 'Город проживания',
    options: [
      { value: 'any', label: 'Не важно' },
      { value: 'moscow', label: 'Москва' },
      { value: 'piter', label: 'Санкт-Петербург' },
      { value: 'volgograd', label: 'Волгоград' },
    ],
    required: true,
    placeholder: 'Выберите город',
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
  {
    type: 'multiple-input',
    label: 'Дополнительные навыки',
    name: 'additional_skills',
    required: true,
    placeholder: 'Например, владение Photoshop',
    helperText: 'Укажите дополнительные навыки',
  },
]
