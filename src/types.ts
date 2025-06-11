export enum OrderBy {
  none = 'none',
  forward = 'forward',
  backward = 'backward',
}

export enum GameType {
  teamPlay = 'teamplay',
  PvP = 'pvp',
}

export interface IAnswer {
  id: number;
  text?: string;
  points?: number;
  opened: boolean;
}

export interface IQuestion {
  enable: boolean;
  stageName: string;
  questionText?: string | null;
  answers: IAnswer[];
  orderBy: OrderBy;
}

export interface ITeam {
  name?: string | null;
  points: number;
  fails: number;
  players: IPlayer[];
}

export interface IPlayer {
  name?: string | null;
  points: number;
  fails: number;
}

export interface IGame {
  name: string;
  questions: IQuestion[];
  showQuestionsText: boolean;
  maxFails: number;
  teamLeft: ITeam;
  teamRight: ITeam;
  currentStage: number;
  commonPoints: number;
  players: IPlayer[];
  gameType: GameType;
}

export interface IGameSettings {
  game: IGame;
  authorName?: string;
  authorDescription?: string;
  createDate: number;
  lastEditQuestion: number;
  lastEditDate?: number | null;
}

/**
 * Объект, описывающий текущего игрока / команды (от кого ожидается ответ и к кому перейдут очки в случае победы)
 * В режиме командной игры поле team обязательно, если playerIndex не указан -- текущей считается вся команда, если указан
 * -- используется как индекс игрока в этой команде
 * В режиме pvp обязательно должен быть указан только playerIndex.
 */
export interface IActivePlayer {
  team: TeamTypes;
  player?: number | null;
}

export type TeamTypes = 'teamLeft' | 'teamRight';
