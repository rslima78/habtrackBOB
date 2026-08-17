import React, { useState, useRef } from 'react';
import { AppState, StorageService } from '../../services/storageService';
import { AppSettings, UserProfile } from '../../types';
import { Settings, Save, Download, Upload, RotateCcw, Volume2, VolumeX, Sparkles, UserPlus, Smartphone, CheckCircle2 } from 'lucide-react';
import { soundEngine } from '../../services/audioService';

interface SettingsViewProps {
  state: AppState;
  onUpdateState: (updater: (prev: AppState) => AppState) => void;
  onOpenNewHeroModal: () => void;
  onResetSeed: () => void;
  onShowLevelUpTest: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  state,
  onUpdateState,
  onOpenNewHeroModal,
  onResetSeed,
  onShowLevelUpTest
}) => {
  const [userName, setUserName] = useState(state.user.name);
  const [workoutWeeklyGoal, setWorkoutWeeklyGoal] = useState(String(state.settings.workoutWeeklyGoal));
  const [readingDailyPagesGoal, setReadingDailyPagesGoal] = useState(String(state.settings.readingDailyPagesGoal));
  const [budgetDailyLimit, setBudgetDailyLimit] = useState(String(state.settings.budgetDailyLimit));
  const [currency, setCurrency] = useState(state.settings.currency || 'R$');

  // XP Config
  const [xpWalk, setXpWalk] = useState(String(state.settings.xpValues.walk));
  const [xpRun, setXpRun] = useState(String(state.settings.xpValues.run));
  const [xpReading, setXpReading] = useState(String(state.settings.xpValues.readingDailyGoal));
  const [xpBudget, setXpBudget] = useState(String(state.settings.xpValues.budgetUnderLimit));
  const [xpFood, setXpFood] = useState(String(state.settings.xpValues.foodControlled));

  const [savedSuccess, setSavedSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playPop();

    const updatedSettings: AppSettings = {
      ...state.settings,
      workoutWeeklyGoal: parseInt(workoutWeeklyGoal) || 4,
      readingDailyPagesGoal: parseInt(readingDailyPagesGoal) || 20,
      budgetDailyLimit: parseFloat(budgetDailyLimit) || 80.0,
      currency,
      xpValues: {
        ...state.settings.xpValues,
        walk: parseInt(xpWalk) || 20,
        run: parseInt(xpRun) || 40,
        readingDailyGoal: parseInt(xpReading) || 20,
        budgetUnderLimit: parseInt(xpBudget) || 30,
        foodControlled: parseInt(xpFood) || 30
      }
    };

    const updatedUser: UserProfile = {
      ...state.user,
      name: userName.trim() || 'Guerreiro'
    };

    onUpdateState(prev => ({
      ...prev,
      user: updatedUser,
      settings: updatedSettings
    }));

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExport = () => {
    soundEngine.playClick();
    StorageService.exportBackup(state);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        const imported = StorageService.importBackup(json);
        onUpdateState(() => imported);
        soundEngine.playLevelUp();
        alert('Backup restaurado com sucesso!');
      } catch (err) {
        alert('Erro ao importar backup. Arquivo JSON inválido.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Top Banner */}
      <div className="game-card bg-gradient-to-r from-[#1E1B33] to-[#121422] border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border-2 border-purple-400/40 text-purple-300 flex items-center justify-center text-2xl shadow-game-purple">
            ⚙️
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Configurações & Personagem</h2>
            <p className="text-xs text-slate-400">Personalize seu herói, limites, metas e backups locais</p>
          </div>
        </div>
      </div>

      {/* 📱 Mobile Storage Notice Banner */}
      <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-4 flex items-start gap-3">
        <Smartphone className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-black text-white flex items-center gap-1.5">
            Armazenamento Local no Celular Ativo
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </h4>
          <p className="text-xs text-emerald-200/90 mt-1">
            Seus dados são salvos continuamente na memória local do seu aparelho celular. Você pode usar o aplicativo offline normalmente e também instalá-lo na tela inicial do seu celular como aplicativo PWA!
          </p>
        </div>
      </div>

      {/* ⚔️ New Hero & Hero Management */}
      <div className="game-card border-amber-500/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <span>⚔️</span> Gerenciamento do Herói
            </h3>
            <p className="text-xs text-slate-400">Comece uma jornada do zero ou teste outros cenários</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onOpenNewHeroModal}
              className="flex-1 sm:flex-none btn-game-gold text-slate-950 text-xs font-black py-2.5 px-4 rounded-xl cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              Criar Novo Herói (Começar do Zero)
            </button>
            <button
              type="button"
              onClick={() => {
                if (confirm('Deseja carregar os dados de demonstração (Robson Nível 4 Ninja com 30 dias de histórico)?')) {
                  soundEngine.playLevelUp();
                  onResetSeed();
                }
              }}
              className="btn-game-ghost text-xs font-bold py-2.5 px-3 rounded-xl cursor-pointer text-amber-300"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Demonstração
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* 👤 User Profile Section */}
        <div className="game-card">
          <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <span>👤</span> Perfil do Jogador
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Nome do Herói</label>
              <input
                type="text"
                required
                value={userName}
                onChange={e => setUserName(e.target.value)}
                className="w-full bg-[#121422] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-bold focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Efeitos Sonoros do Jogo</label>
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    const next = !state.user.soundEnabled;
                    soundEngine.setSoundEnabled(next);
                    if (next) soundEngine.playClick();
                    onUpdateState(prev => ({
                      ...prev,
                      user: { ...prev.user, soundEnabled: next }
                    }));
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer flex items-center gap-2 ${
                    state.user.soundEnabled
                      ? 'bg-purple-600 text-white border-purple-400 shadow-game-purple'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {state.user.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  <span>{state.user.soundEnabled ? 'Sons Ativados' : 'Sons Desativados'}</span>
                </button>

                <button
                  type="button"
                  onClick={onShowLevelUpTest}
                  className="px-3 py-2 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Testar Level Up
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 🎯 Habits & Goals Configuration */}
        <div className="game-card">
          <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <span>🎯</span> Metas dos 4 Hábitos Principais
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">🏃 Treinos por Semana</label>
              <input
                type="number"
                min="1"
                max="14"
                required
                value={workoutWeeklyGoal}
                onChange={e => setWorkoutWeeklyGoal(e.target.value)}
                className="w-full bg-[#121422] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-bold focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">📚 Páginas de Leitura / Dia</label>
              <input
                type="number"
                min="1"
                required
                value={readingDailyPagesGoal}
                onChange={e => setReadingDailyPagesGoal(e.target.value)}
                className="w-full bg-[#121422] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-bold focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">💰 Limite Diário de Gastos</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currency}
                  onChange={e => setCurrency(e.target.value)}
                  className="w-14 bg-[#121422] border border-slate-700 rounded-xl px-2 py-2 text-sm text-white font-bold text-center focus:border-emerald-500 focus:outline-none"
                  placeholder="R$"
                />
                <input
                  type="number"
                  step="1"
                  min="1"
                  required
                  value={budgetDailyLimit}
                  onChange={e => setBudgetDailyLimit(e.target.value)}
                  className="flex-1 bg-[#121422] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-bold focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ⚡ Custom XP Values */}
        <div className="game-card">
          <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <span>⚡</span> Valores de Recompensa em XP
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">Caminhada</label>
              <input
                type="number"
                value={xpWalk}
                onChange={e => setXpWalk(e.target.value)}
                className="w-full bg-[#121422] border border-slate-700 rounded-xl px-2 py-1.5 text-xs text-white font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">Corrida</label>
              <input
                type="number"
                value={xpRun}
                onChange={e => setXpRun(e.target.value)}
                className="w-full bg-[#121422] border border-slate-700 rounded-xl px-2 py-1.5 text-xs text-white font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">Leitura Diária</label>
              <input
                type="number"
                value={xpReading}
                onChange={e => setXpReading(e.target.value)}
                className="w-full bg-[#121422] border border-slate-700 rounded-xl px-2 py-1.5 text-xs text-white font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">Orçamento Ok</label>
              <input
                type="number"
                value={xpBudget}
                onChange={e => setXpBudget(e.target.value)}
                className="w-full bg-[#121422] border border-slate-700 rounded-xl px-2 py-1.5 text-xs text-white font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">Dieta Controlada</label>
              <input
                type="number"
                value={xpFood}
                onChange={e => setXpFood(e.target.value)}
                className="w-full bg-[#121422] border border-slate-700 rounded-xl px-2 py-1.5 text-xs text-white font-bold"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="flex-1 btn-game-gold text-slate-950 font-black py-3 rounded-2xl cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Salvar Alterações
          </button>

          {savedSuccess && (
            <span className="text-xs font-black text-emerald-400 animate-fade-in">
              Salvo com sucesso! ✨
            </span>
          )}
        </div>

      </form>

      {/* 💾 Backup & Data Management */}
      <div className="game-card border-slate-800">
        <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <span>💾</span> Backup e Exportação
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          <button
            type="button"
            onClick={handleExport}
            className="btn-game-ghost text-xs font-bold py-2.5 px-3 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            Exportar Backup JSON
          </button>

          <div>
            <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full btn-game-ghost text-xs font-bold py-2.5 px-3 flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4 text-blue-400" />
              Restaurar Backup JSON
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
