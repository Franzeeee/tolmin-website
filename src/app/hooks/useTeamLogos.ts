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

      await Promise.all(
        teamIds.map(async (teamId) => {
          try {
            const { data } = await axios.get<TeamLogoResponse>(
              `/api/tolmin/team?teamId=${teamId}`
            );

            logos[teamId] = `https://static.soccerway.com/team/${data.img_id}/participant-logo-mobile-100x100/image.png`;
          } catch (err) {
            console.error("Failed fetching logo for team:", teamId, err);
            logos[teamId] = "/logo/placeholder-team.png";
          }
        })
      );

      return logos;
    },
    staleTime: 1000 * 60 * 60 * 24,
  });
}
