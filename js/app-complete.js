// Complete self-contained JavaScript for Talking Animals App
// No external dependencies required

// ===== ANIMAL DATA =====
// Fallback embedded data (used if file loading fails due to CORS)
const FALLBACK_ANIMAL_DATA = {
  "корова": { "image_url": "🐄", "sound_text": "муууу" },
  "собака": { "image_url": "🐕", "sound_text": "гав-гав" },
  "кошка": { "image_url": "🐱", "sound_text": "мяу-мяу" },
  "петух": { "image_url": "🐓", "sound_text": "ку-ка-ре-ку" },
  "курица": { "image_url": "🐔", "sound_text": "ко-ко-ко" },
  "свинья": { "image_url": "🐷", "sound_text": "хрю-хрю" },
  "овца": { "image_url": "🐑", "sound_text": "бе-е-е" },
  "коза": { "image_url": "🐐", "sound_text": "ме-е-е" },
  "лошадь": { "image_url": "🐴", "sound_text": "и-го-го" },
  "утка": { "image_url": "🦆", "sound_text": "кря-кря" },
  "гусь": { "image_url": "🪿", "sound_text": "га-га-га" },
  "во рона": { "image_url": "🐦‍⬛", "sound_text": "кар-кар" },
  "воробей": { "image_url": "🐦", "sound_text": "чик-чирик" },
  "сова": { "image_url": "🦉", "sound_text": "ух-ух" },
  "бобр": { "image_url": "🦫", "sound_text": "хлоп-хлоп" },
  "голубь": { "image_url": "🕊️", "sound_text": "гур-гур" },
  "ли са": { "image_url": "🦊", "sound_text": "тяв-тяв" },
  "волк": { "image_url": "🐺", "sound_text": "ау-у-у" },
  "медведь": { "image_url": "🐻", "sound_text": "р-р-р" },
  "ёжик": { "image_url": "🦔", "sound_text": "фр-фр" },
  "белка": { "image_url": "🐿️", "sound_text": "цок-цок" },
  "заяц": { "image_url": "🐰", "sound_text": "прыг-прыг" },
  "лягушка": { "image_url": "🐸", "sound_text": "ква-ква" },
  "лебедь": { "image_url": "🦢", "sound_text": "кур-лы" },
  "мышка": { "image_url": "🐭", "sound_text": "пи-пи" },
  "кузнечик": { "image_url": "🦗", "sound_text": "стр-стр" },
  "пчела": { "image_url": "🐝", "sound_text": "ж-ж-ж" },
  "цыплёнок": { "image_url": "🐤", "sound_text": "пи-пи-пи" },
  "тюлень": { "image_url": "🦭", "sound_text": "ар-ар" },
  "ко мар": { "image_url": "🦟", "sound_text": "з-з-з" }
};

// Animal IDs for loading
const ANIMAL_IDS = [
  "корова", "собака", "кошка", "петух", "курица", "свинья", "овца", "коза", 
  "лошадь", "утка", "гусь", "во рона", "воробей", "сова", "бобр", "голубь", 
  "ли са", "волк", "медведь", "ёжик", "белка", "заяц", "лягушка", "лебедь", 
  "мышка", "кузнечик", "пчела", "цыплёнок", "тюлень", "ко мар"
];

/**
 * Load data for a single animal from file with fallback to embedded data
 * @param {string} id - Animal ID
 * @returns {Promise<Object|null>} Animal data or null if failed
 */
async function loadAnimalData(id) {
  try {
    // First try to load from file
    const response = await fetch(`animals_data/${id}.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(`Loaded ${id} from file`);
    return { 
      ...data, 
      id: id, 
      name: capitalizeFirstLetter(id)
    };
  } catch (error) {
    // Fallback to embedded data
    console.warn(`Failed to load ${id} from file, using fallback:`, error.message);
    if (FALLBACK_ANIMAL_DATA[id]) {
      return { 
        ...FALLBACK_ANIMAL_DATA[id], 
        id: id, 
        name: capitalizeFirstLetter(id)
      };
    }
    console.error(`No fallback data available for ${id}`);
    return null;
  }
}

/**
 * Load all animal data from files with fallback
 * @returns {Promise<Array>} Array of animal objects
 */
async function loadAllAnimals() {
  console.log('Loading animal data from files...');
  
  try {
    const animalPromises = ANIMAL_IDS.map(id => loadAnimalData(id));
    const animalsData = await Promise.all(animalPromises);
    const validAnimals = animalsData.filter(animal => animal !== null);
    
    console.log(`Successfully loaded ${validAnimals.length} out of ${ANIMAL_IDS.length} animals`);
    
    // Check if we used any file-based loading
    const fileLoadedCount = validAnimals.length;
    const fallbackUsed = fileLoadedCount < ANIMAL_IDS.length;
    
    if (fallbackUsed) {
      console.warn('Some animals loaded from fallback data due to file access restrictions');
    } else {
      console.log('All animals loaded successfully from files');
    }
    
    return validAnimals;
  } catch (error) {
    console.error('Error loading animals, using all fallback data:', error);
    // Complete fallback - use all embedded data
    return Object.keys(FALLBACK_ANIMAL_DATA).map(id => ({
      ...FALLBACK_ANIMAL_DATA[id],
      id,
      name: capitalizeFirstLetter(id)
    }));
  }
}

// ===== UTILITY FUNCTIONS =====
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ===== TEXT-TO-SPEECH (Cordova Plugin) =====
function speak(text, lang = 'ru-RU') {
  return new Promise((resolve, reject) => {
    // Check if Cordova TTS plugin is available
    if (typeof TTS === 'undefined' || !TTS) {
      // Fallback to Web Speech API if Cordova TTS is not available
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.onend = () => resolve();
        utterance.onerror = (event) => {
          if (event.error === 'interrupted') {
            resolve(); 
          } else {
            reject(new Error(event.error || "UNKNOWN_TTS_ERROR"));
          }
        };
        window.speechSynthesis.speak(utterance);
      } else {
        reject(new Error("TTS_NOT_SUPPORTED"));
      }
      return;
    }

    // Use Cordova TTS Plugin
    const options = {
      text: text,
      locale: lang,
      rate: 0.75 // Slightly slower for better comprehension
    };

    TTS.speak(options)
      .then(() => {
        console.log('TTS: Speech completed successfully');
        resolve();
      })
      .catch((error) => {
        console.error('TTS Error:', error);
        // Try fallback to Web Speech API on error
        if ('speechSynthesis' in window) {
          console.log('TTS: Falling back to Web Speech API');
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = lang;
          utterance.onend = () => resolve();
          utterance.onerror = (event) => {
            reject(new Error(event.error || "FALLBACK_TTS_ERROR"));
          };
          window.speechSynthesis.speak(utterance);
        } else {
          reject(new Error(error.message || "CORDOVA_TTS_ERROR"));
        }
      });
  });
}

// Function to stop TTS playback
function stopSpeech() {
  if (typeof TTS !== 'undefined' && TTS) {
    TTS.stop()
      .then(() => console.log('TTS: Speech stopped'))
      .catch((error) => console.error('TTS Stop Error:', error));
  }
  
  // Also stop Web Speech API if available
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// Function to check TTS availability and get supported languages
function getTTSInfo() {
  return new Promise((resolve) => {
    if (typeof TTS === 'undefined' || !TTS) {
      resolve({
        available: false,
        plugin: 'none',
        languages: []
      });
      return;
    }

    TTS.checkLanguage()
      .then((language) => {
        console.log('TTS: Current language:', language);
        resolve({
          available: true,
          plugin: 'cordova',
          currentLanguage: language,
          languages: ['ru-RU', 'en-US'] // Common supported languages
        });
      })
      .catch((error) => {
        console.error('TTS Language Check Error:', error);
        resolve({
          available: true,
          plugin: 'cordova',
          languages: ['ru-RU', 'en-US']
        });
      });
  });
}

// ===== TOAST SYSTEM =====
function showToast(title, description, variant = 'default') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${variant === 'destructive' ? 'destructive' : ''}`;
  
  const titleEl = document.createElement('div');
  titleEl.className = 'toast-title';
  titleEl.textContent = title;
  
  const descEl = document.createElement('div');
  descEl.className = 'toast-description';
  descEl.textContent = description;
  
  toast.appendChild(titleEl);
  toast.appendChild(descEl);
  container.appendChild(toast);
  
  requestAnimationFrame(() => toast.classList.add('show'));
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => container.removeChild(toast), 300);
  }, 5000);
}

// ===== THEME MANAGEMENT =====
function initTheme() {
  const stored = localStorage.getItem('app-theme');
  const theme = stored || 'light';
  applyTheme(theme);
  
  document.getElementById('theme-toggle').addEventListener('click', () => {
    const current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    const newTheme = current === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
    localStorage.setItem('app-theme', newTheme);
  });
}

function applyTheme(theme) {
  const html = document.documentElement;
  const btn = document.getElementById('theme-toggle');
  const svg = btn.querySelector('svg path');
  
  if (theme === 'dark') {
    html.classList.add('dark');
    svg.setAttribute('d', 'M12 2V1m0 22v-1m9-9h1M2 12H1m15.364-6.364l.707-.707M6.343 6.343l-.707-.707m12.728 0l.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z');
  } else {
    html.classList.remove('dark');
    svg.setAttribute('d', 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z');
  }
}

// ===== FULLSCREEN MANAGEMENT =====
let isFullscreen = false;
const fullscreenAPI = !!document.documentElement.requestFullscreen;

function initFullscreen() {
  if (!fullscreenAPI) {
    document.getElementById('fullscreen-fab').style.display = 'none';
    return;
  }
  
  document.getElementById('fullscreen-fab').addEventListener('click', toggleFullscreen);
  document.addEventListener('fullscreenchange', handleFullscreenChange);
}

async function toggleFullscreen() {
  try {
    if (isFullscreen) {
      await document.exitFullscreen();
    } else {
      await document.documentElement.requestFullscreen();
    }
  } catch (e) {
    console.error('Fullscreen error:', e);
  }
}

function handleFullscreenChange() {
  isFullscreen = !!document.fullscreenElement;
  updateFullscreenUI();
}

function updateFullscreenUI() {
  const fab = document.getElementById('fullscreen-fab');
  const svg = fab.querySelector('svg path');
  
  if (isFullscreen) {
    svg.setAttribute('d', 'M4 14h6m-3-3v6m9-7h-6m3-3v6');
    fab.setAttribute('aria-label', 'Выйти из полноэкранного режима');
  } else {
    svg.setAttribute('d', 'M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4');
    fab.setAttribute('aria-label', 'Войти в полноэкранный режим');
  }
  
  document.body.classList.toggle('fullscreen', isFullscreen);
  document.querySelectorAll('.animal-card').forEach(card => {
    card.classList.toggle('fullscreen', isFullscreen);
  });
}

// ===== MAIN APPLICATION =====
class AnimalApp {
  constructor() {
    this.currentView = 'levels';
    this.animals = []; // Will be loaded from files
    this.isLoading = true;
    
    this.currentChallengeAnimal = null;
    this.quizOptions = [];
    this.isGuessing = false;
    this.showFeedback = null;
    
    this.init();
  }

  async init() {
    this.setupEventListeners();
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Load animals from files
    await this.loadAnimals();
    
    this.hideLoading();
  }

  async loadAnimals() {
    console.log('Starting to load animal data...');
    try {
      this.animals = await loadAllAnimals();
      console.log(`Application loaded ${this.animals.length} animals successfully`);
      
      if (this.animals.length === 0) {
        showToast('Ошибка загрузки', 'Не удалось загрузить данные животных', 'destructive');
      }
    } catch (error) {
      console.error('Failed to load animals:', error);
      showToast('Ошибка загрузки', 'Не удалось загрузить данные животных', 'destructive');
      this.animals = []; // Empty array as final fallback
    }
  }

  setupEventListeners() {
    document.getElementById('level-1-btn').addEventListener('click', () => this.handleSelectLevel(1));
    document.getElementById('level-2-btn').addEventListener('click', () => this.handleSelectLevel(2));
    document.getElementById('back-button').addEventListener('click', () => this.showLevelSelection());
    document.getElementById('repeat-sound').addEventListener('click', () => this.repeatSound());
    document.getElementById('next-question').addEventListener('click', () => this.selectNewChallenge());
  }

  hideLoading() {
    document.getElementById('loading-spinner').style.display = 'none';
    document.getElementById('app').style.display = 'flex';
  }

  handleSelectLevel(level) {
    if (level === 1) {
      this.showLevel1();
    } else {
      this.showLevel2();
    }
    
    if (fullscreenAPI) {
      document.documentElement.requestFullscreen().catch(e => console.log('Fullscreen denied'));
    }
  }

  showLevelSelection() {
    this.currentView = 'levels';
    this.updateViews();
    if (isFullscreen) toggleFullscreen();
  }

  showLevel1() {
    this.currentView = 'level1';
    this.updateViews();
    this.renderLevel1();
  }

  showLevel2() {
    this.currentView = 'level2';
    this.updateViews();
    this.selectNewChallenge();
  }

  updateViews() {
    ['level-selection', 'level-1', 'level-2'].forEach(id => {
      document.getElementById(id).classList.add('hidden');
    });
    
    const viewMap = {
      'levels': 'level-selection',
      'level1': 'level-1', 
      'level2': 'level-2'
    };
    
    document.getElementById(viewMap[this.currentView]).classList.remove('hidden');
    
    const isInLevel = this.currentView !== 'levels';
    document.getElementById('app').classList.toggle('in-level', isInLevel);
    document.getElementById('back-button').classList.toggle('hidden', !isInLevel);
    document.getElementById('theme-toggle').classList.toggle('hidden-in-level', isInLevel);
    document.getElementById('app-footer').classList.toggle('hidden-in-level', isInLevel);
    document.getElementById('fullscreen-fab').classList.toggle('hidden', !isInLevel);
  }

  renderLevel1() {
    const grid = document.getElementById('level-1-grid');
    grid.innerHTML = '';
    
    this.animals.forEach(animal => {
      const card = this.createAnimalCard(animal, () => this.handleAnimalClick(animal));
      grid.appendChild(card);
    });
  }

  createAnimalCard(animal, onClick, disabled = false) {
    const card = document.createElement('div');
    card.className = `animal-card ${disabled ? 'disabled' : ''} ${isFullscreen ? 'fullscreen' : ''}`;
    card.setAttribute('aria-label', `${animal.name} - ${animal.sound_text}`);
    card.setAttribute('tabindex', disabled ? '-1' : '0');
    
    const emoji = document.createElement('div');
    emoji.className = 'animal-emoji';
    emoji.textContent = animal.image_url;
    
    const name = document.createElement('p');
    name.className = 'animal-name';
    name.textContent = animal.name;
    
    card.appendChild(emoji);
    card.appendChild(name);
    
    if (!disabled) {
      card.addEventListener('click', () => onClick(animal));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(animal);
        }
      });
    }
    
    return card;
  }

  async handleAnimalClick(animal) {
    try {
      await speak(`${animal.sound_text}, ${animal.name}`);
    } catch (error) {
      const msg = error.message === "TTS_NOT_SUPPORTED" 
        ? "Ваш браузер не поддерживает синтез речи."
        : `Ошибка воспроизведения: ${error.message}`;
      showToast("Ошибка TTS", msg, 'destructive');
    }
  }

  async selectNewChallenge() {
    if (this.animals.length < 4) {
      showToast("Мало данных", "Недостаточно животных для викторины.", 'destructive');
      return;
    }

    this.isGuessing = false;
    this.showFeedback = null;
    this.updateLevel2UI();

    const randomIndex = Math.floor(Math.random() * this.animals.length);
    this.currentChallengeAnimal = this.animals[randomIndex];

    const distractors = shuffleArray(this.animals.filter(a => a.id !== this.currentChallengeAnimal.id)).slice(0, 3);
    this.quizOptions = shuffleArray([this.currentChallengeAnimal, ...distractors]);
    
    this.renderLevel2();
    await this.playSoundAndName(this.currentChallengeAnimal);
  }

  async playSoundAndName(animal) {
    try {
      await speak(`${animal.sound_text} ${animal.name}`);
    } catch (error) {
      const msg = error.message === "TTS_NOT_SUPPORTED" 
        ? "Ваш браузер не поддерживает синтез речи."
        : `Ошибка воспроизведения: ${error.message}`;
      showToast("Ошибка TTS", msg, 'destructive');
    }
  }

  async repeatSound() {
    if (this.currentChallengeAnimal && !this.isGuessing) {
      await this.playSoundAndName(this.currentChallengeAnimal);
    }
  }

  renderLevel2() {
    const grid = document.getElementById('level-2-grid');
    grid.innerHTML = '';
    
    this.quizOptions.forEach(animal => {
      const card = this.createAnimalCard(animal, (animal) => this.handleAnimalGuess(animal), this.isGuessing);
      grid.appendChild(card);
    });
  }

  async handleAnimalGuess(guessedAnimal) {
    if (!this.currentChallengeAnimal || this.isGuessing) return;

    this.isGuessing = true;
    const isCorrect = guessedAnimal.id === this.currentChallengeAnimal.id;
    const feedbackText = isCorrect ? "Молодец!!!" : "Попробуй ещё";
    this.showFeedback = isCorrect ? "correct" : "incorrect";
    
    this.updateLevel2UI();

    try {
      await speak(feedbackText);
    } catch (error) {
      showToast("Ошибка TTS", "Не удалось воспроизвести звук", 'destructive');
    }

    setTimeout(() => {
      if (isCorrect) {
        this.selectNewChallenge();
      } else {
        this.isGuessing = false;
        this.showFeedback = null;
        this.updateLevel2UI();
        await this.repeatSound();
      }
    }, 1500);
  }

  updateLevel2UI() {
    const feedback = document.getElementById('feedback');
    if (this.showFeedback) {
      feedback.textContent = this.showFeedback === 'correct' ? 'Молодец!!! 🎉' : 'Попробуй ещё 🤔';
      feedback.className = `feedback ${this.showFeedback}`;
      feedback.classList.remove('hidden');
    } else {
      feedback.classList.add('hidden');
    }

    document.getElementById('repeat-sound').disabled = this.isGuessing;
    document.getElementById('next-question').disabled = this.isGuessing;

    if (this.currentView === 'level2') {
      this.renderLevel2();
    }
  }
}

// ===== INITIALIZATION =====
let appInitialized = false;

function initializeApp() {
  if (appInitialized) return;
  appInitialized = true;
  
  console.log('Initializing app...');
  initTheme();
  initFullscreen();
  
  // Get TTS info for debugging
  getTTSInfo().then(info => {
    console.log('TTS Info:', info);
    if (info.available) {
      showToast('TTS готов', `Используется ${info.plugin === 'cordova' ? 'Cordova TTS' : 'Web Speech API'}`);
    } else {
      showToast('TTS недоступен', 'Синтез речи не поддерживается', 'destructive');
    }
  });
  
  new AnimalApp();
}

// Handle both DOM Content Loaded and Cordova Device Ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM Content Loaded');
  // Check if Cordova is present
  if (typeof cordova !== 'undefined') {
    console.log('Cordova detected, waiting for deviceready...');
    // Wait for deviceready if Cordova is present
    document.addEventListener('deviceready', () => {
      console.log('Cordova device ready');
      initializeApp();
    }, false);
  } else {
    console.log('No Cordova detected, initializing immediately');
    // Initialize immediately if no Cordova
    initializeApp();
  }
});

// Fallback initialization after a delay (in case deviceready doesn't fire)
setTimeout(() => {
  if (!appInitialized) {
    console.log('Fallback initialization triggered');
    initializeApp();
  }

}, 3000);
