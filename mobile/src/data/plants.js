export const PLANTS = [
  {
    id: 'tomato',
    name: 'Tomato',
    emoji: '🍅',
    diseases: [
      'Bacterial spot',
      'Early blight',
      'Late blight',
      'Leaf Mold',
      'Septoria leaf spot',
      'Spider mites',
      'Target Spot',
      'Yellow Leaf Curl Virus',
      'Mosaic virus',
      'Healthy',
    ],
  },
  {
    id: 'apple',
    name: 'Apple',
    emoji: '🍎',
    diseases: ['Apple scab', 'Black rot', 'Cedar apple rust', 'Healthy'],
  },
  {
    id: 'potato',
    name: 'Potato',
    emoji: '🥔',
    diseases: ['Early blight', 'Late blight', 'Healthy'],
  },
  {
    id: 'corn',
    name: 'Corn',
    emoji: '🌽',
    diseases: ['Cercospora leaf spot', 'Common rust', 'Northern Leaf Blight', 'Healthy'],
  },
  {
    id: 'grape',
    name: 'Grape',
    emoji: '🍇',
    diseases: ['Black rot', 'Esca (Black Measles)', 'Leaf blight', 'Healthy'],
  },
  {
    id: 'peach',
    name: 'Peach',
    emoji: '🍑',
    diseases: ['Bacterial spot', 'Healthy'],
  },
  {
    id: 'pepper',
    name: 'Bell Pepper',
    emoji: '🫑',
    diseases: ['Bacterial spot', 'Healthy'],
  },
  {
    id: 'strawberry',
    name: 'Strawberry',
    emoji: '🍓',
    diseases: ['Leaf scorch', 'Healthy'],
  },
  {
    id: 'cherry',
    name: 'Cherry',
    emoji: '🍒',
    diseases: ['Powdery mildew', 'Healthy'],
  },
  {
    id: 'orange',
    name: 'Orange',
    emoji: '🍊',
    diseases: ['Haunglongbing (Citrus greening)'],
  },
  {
    id: 'blueberry',
    name: 'Blueberry',
    emoji: '🫐',
    diseases: ['Healthy'],
  },
  {
    id: 'raspberry',
    name: 'Raspberry',
    emoji: '🍈',
    diseases: ['Healthy'],
  },
  {
    id: 'soybean',
    name: 'Soybean',
    emoji: '🌱',
    diseases: ['Healthy'],
  },
  {
    id: 'squash',
    name: 'Squash',
    emoji: '🎃',
    diseases: ['Powdery mildew'],
  },
];

export const MOCK_RESULTS = [
  { disease: 'Early blight', severity: 'Moderate', confidence: 0.87, model: 'Custom CNN' },
  { disease: 'Late blight', severity: 'Severe', confidence: 0.93, model: 'EfficientNet-B4' },
  { disease: 'Healthy', severity: 'None', confidence: 0.96, model: 'Custom CNN' },
  { disease: 'Bacterial spot', severity: 'Mild', confidence: 0.79, model: 'EfficientNet-B4' },
  { disease: 'Powdery mildew', severity: 'Moderate', confidence: 0.84, model: 'Custom CNN' },
  { disease: 'Leaf Mold', severity: 'Mild', confidence: 0.81, model: 'EfficientNet-B4' },
];

export const SEVERITY_COLORS = {
  Healthy: '#4CAF50',
  None: '#4CAF50',
  Mild: '#FFC107',
  Moderate: '#FF9800',
  Severe: '#F44336',
};
