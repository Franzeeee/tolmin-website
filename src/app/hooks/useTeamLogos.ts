import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const corsProxy = "https://cors-anywhere.herokuapp.com/";

type TeamLogoResponse = {
  participant: {
    img_id: string;
  };
};

export function useTeamLogos(teamIds: string[]) {
  return useQuery({
    queryKey: ["team-logos", teamIds],
    queryFn: async () => {
      const logos: Record<string, string> = {};

      for (const teamId of teamIds) {
        try {
          const { data } = await axios.get<TeamLogoResponse>(
            `${corsProxy}https://int.soccerway.com/v1/english/participant/soccer/full/${teamId}/`
          );

          const imgId = data.participant.img_id;

          // ✅ Correct Soccerway logo URL format
          logos[teamId] = `https://static.soccerway.com/img/teams/1/${imgId}.png`;
        } catch (err) {
          console.error("Failed fetching logo for team:", teamId, err);
        }
      }

      return logos;
    },
    staleTime: 1000 * 60 * 60 * 24, // cache logos for 1 day
  });
}
