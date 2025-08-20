import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type TeamLogoResponse = {
  img_id: string;
};

export function useTeamLogos(teamIds: string[]) {
  return useQuery({
    queryKey: ["team-logos", teamIds],
    queryFn: async () => {
      const logos: Record<string, string> = {};

      for (const teamId of teamIds) {
        try {
          const { data } = await axios.get<TeamLogoResponse>(
            `/api/fetch?url=https://int.soccerway.com/v1/english/participant/soccer/full/${teamId}/`
          );

          const imgId = data.img_id;

          // ✅ Correct Soccerway logo URL format
          logos[teamId] = `https://static.soccerway.com/team/${imgId}/participant-logo-mobile-100x100/image.png`;
        } catch (err) {
          console.error("Failed fetching logo for team:", teamId, err);
        }
      }

      return logos;
    },
  });
}
