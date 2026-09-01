const tabs = [...document.querySelectorAll('.date-tab')];
const panels = [...document.querySelectorAll('.day-sheet')];
const progressText = document.querySelector('#progressText');
const nextButton = document.querySelector('#nextDay');

const pageLabels = [
  '行前 · 雪地準備',
  '餐廳候選',
  '12/18 · 抵達與下呂',
  '12/19 · 新穗高',
  '12/20 · 高山與白川鄉',
  '12/21 · 金澤',
  '12/22 · 富山海岸',
  '12/23 · 福井至名古屋',
  '12/24 · 犬山城',
  '12/25 · 待安排',
  '12/26 · 返程',
  '住宿費用'
];

function activatePanel(panelId, options = {}) {
  const index = tabs.findIndex((tab) => tab.dataset.panel === panelId);
  if (index < 0) return;

  tabs.forEach((tab, tabIndex) => {
    const active = tabIndex === index;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });

  panels.forEach((panel) => {
    const active = panel.id === panelId;
    panel.hidden = !active;
    panel.classList.toggle('is-active', active);
  });

  const activeTab = tabs[index];
  activeTab.scrollIntoView({ behavior: options.instant ? 'auto' : 'smooth', inline: 'center', block: 'nearest' });
  if (panelId === 'pre-trip') {
    progressText.textContent = 'BEFORE WE GO · 行前準備';
  } else if (panelId === 'restaurants') {
    progressText.textContent = 'FOOD POCKET LIST · 餐廳候選';
  } else if (panelId === 'costs') {
    progressText.textContent = 'STAY LEDGER · 住宿費';
  } else {
    const dayNumber = panelId.match(/day-(\d+)/)?.[1] ?? '';
    progressText.textContent = `DAY ${dayNumber} · ${activeTab.querySelector('b').textContent}`;
  }

  const nextIndex = (index + 1) % tabs.length;
  nextButton.dataset.next = tabs[nextIndex].dataset.panel;
  nextButton.querySelector('span').textContent = nextIndex === 0 ? '回到行前' : '下一頁';
  nextButton.querySelector('b').textContent = pageLabels[nextIndex];

  if (!options.skipHash) history.replaceState(null, '', `#${panelId}`);
  if (options.focusPanel) document.querySelector('#trip-content').focus({ preventScroll: true });
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => activatePanel(tab.dataset.panel, { focusPanel: true }));
  tab.addEventListener('keydown', (event) => {
    const currentIndex = tabs.indexOf(tab);
    let targetIndex;
    if (event.key === 'ArrowRight') targetIndex = (currentIndex + 1) % tabs.length;
    if (event.key === 'ArrowLeft') targetIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    if (targetIndex === undefined) return;
    event.preventDefault();
    tabs[targetIndex].focus();
    activatePanel(tabs[targetIndex].dataset.panel);
  });
});

document.querySelectorAll('[data-food-target]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelector(`#${button.dataset.foodTarget}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

nextButton.addEventListener('click', () => {
  activatePanel(nextButton.dataset.next, { focusPanel: true });
  window.scrollTo({ top: document.querySelector('.date-tabs').offsetTop, behavior: 'smooth' });
});

const initialPanel = location.hash.slice(1);
activatePanel(tabs.some((tab) => tab.dataset.panel === initialPanel) ? initialPanel : 'pre-trip', { instant: true, skipHash: !initialPanel });
