import { teamData } from '../controllers/interfaces/controller.lb.interface';

export default (array: teamData[]): teamData[] => array
  .sort((a, b) => {
    if (b.totalPoints - a.totalPoints !== 0) return b.totalPoints - a.totalPoints;
    if (b.totalVictories - a.totalVictories !== 0) return b.totalVictories - a.totalVictories;
    if (b.goalsBalance - a.goalsBalance !== 0) return b.goalsBalance - a.goalsBalance;
    return b.goalsFavor - a.goalsFavor;
  });
