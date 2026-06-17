export interface Team {
  name:     string;
  initials: string;
  logoUrl:  string;
  gradient: string;
  logoAlt:  string;
}

export interface SportsMatch {
  id:       string;
  league:   string;
  status:   "live" | "upcoming";
  time?:    string;
  venue?:   string;
  homeTeam: Team;
  awayTeam: Team;
  score?:   string;
}
