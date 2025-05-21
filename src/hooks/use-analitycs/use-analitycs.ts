// store/useAnalytics.ts
import { create } from "zustand";
import { Quote, PatientProfile, Relationship } from "@/@types/quotes";
import { differenceInYears } from "date-fns";
import { toast } from "sonner";
import { api } from "@/lib/axios/axios";

type ProfileData = {
  psychologicalProfile?: PatientProfile;
  avgAge?: number;
  relationshipAvg?: string;
  avgTicket?: number;
  mostCommonTreatment?: string;
};

type Dentist = {
  id: string;
  name: string;
  photo: string;
  specialty: string;
};

type TreatmentStat = {
  name: string;
  quoted: number;
  closed: number;
  conversion: number;
};

type FilterType = "all" | string;

interface AnalyticsStore {
  quotes: Quote[];
  paidQuotes: Quote[];

  dentists: Dentist[];
  setDentists: (dentists: Dentist[]) => void;
  handleGetDentists: (id: string) => Promise<void>;

  treatmentStats: TreatmentStat[];

  dentistFilter: FilterType;
  setQuotes: (quotes: Quote[]) => void;
  setDentistFilter: (id: FilterType) => void;
  mostCommonProfileData: ProfileData;
  bestConversionProfileData: ProfileData;

  seggestionsIsLoading: boolean;
  setSeggestionsIsLoading: (seggestionsIsLoading: boolean) => void;

  suggestions: { phrase: string }[];
  setSuggestions: (suggestions: { phrase: string }[]) => void;

  generateAnalytics: (
    quotes: Quote[],
    paidQuotes: Quote[],
    dentistFilter: FilterType
  ) => void;
  getProfileDisplayName: (profile?: PatientProfile) => string;
  getClinicProfileDescription: (
    dentistId: FilterType,
    quotes: Quote[]
  ) => string;
  generateSuggestionWithIA: (
    quotes: Quote[],
    dentistFilter: FilterType
  ) => Promise<string | null>;
}

export const useAnalytics = create<AnalyticsStore>((set, get) => ({
  quotes: [],
  paidQuotes: [],

  dentists: [],
  setDentists: (dentists) => set({ dentists }),
  handleGetDentists: async (id) => {
    const { setDentists } = useAnalytics.getState();

    try {
      const dentistsData = await api.post("/dentist/get-by-clinic", {
        clinicId: id,
      });
      setDentists(dentistsData.data);

      return dentistsData?.data;
    } catch (error) {
      toast.error("Erro ao carregar dentistas", {
        description:
          error instanceof Error ? error.message : "Tente novamente mais tarde",
      });
    }
  },

  treatmentStats: [],
  dentistFilter: "all",

  setQuotes: (quotes) => {
    const paid = quotes.filter((q) => q.status === "paid");
    set({ quotes, paidQuotes: paid });
  },

  setDentistFilter: (id) => set({ dentistFilter: id }),

  mostCommonProfileData: {},
  bestConversionProfileData: {},

  seggestionsIsLoading: false,
  setSeggestionsIsLoading: (seggestionsIsLoading) =>
    set({ seggestionsIsLoading }),

  suggestions: [],
  setSuggestions: (suggestions) => set({ suggestions }),

  getProfileDisplayName: (profile) => {
    switch (profile) {
      case "aesthetic-emotional":
        return "Estético Emocional";
      case "aesthetic-rational":
        return "Estético Racional";
      case "health-emotional":
        return "Saúde Emocional";
      case "health-rational":
        return "Saúde Racional";
      default:
        return "Desconhecido";
    }
  },

  getClinicProfileDescription: (dentistId: FilterType, quotes: Quote[]) => {
    const { getProfileDisplayName, mostCommonProfileData } =
      useAnalytics.getState();
    const filtered =
      dentistId === "all"
        ? quotes
        : quotes.filter((q) => q.dentistId === dentistId);

    const profileCounts: Record<PatientProfile, number> = {
      "aesthetic-emotional": 0,
      "aesthetic-rational": 0,
      "health-emotional": 0,
      "health-rational": 0,
    };

    filtered.forEach(
      (q) => q.patientProfile && profileCounts[q.patientProfile]++
    );

    const mostCommon = Object.entries(profileCounts).reduce((a, b) =>
      b[1] > a[1] ? b : a
    )[0] as PatientProfile;

    const analiticsClinic: string = `Sua clínica atende majoritariamente pacientes com perfil ${getProfileDisplayName(
      mostCommonProfileData.psychologicalProfile
    )}, com idade média de ${
      mostCommonProfileData.avgAge
    } anos e relacionamento médio de ${
      mostCommonProfileData.relationshipAvg
    }. O tratamento mais orçado é ${
      mostCommonProfileData.mostCommonTreatment
    }. O valor médio dos orçamentos é de R$ ${Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(
      Number(mostCommonProfileData.avgTicket)
    )}. O perfil que mais fecha orçamentos é ${getProfileDisplayName(
      mostCommonProfileData.psychologicalProfile
    )},o que indica uma oportunidade para redirecionar esforços de captação.`;

    switch (mostCommon) {
      case "aesthetic-emotional":
        return analiticsClinic;
      case "aesthetic-rational":
        return analiticsClinic;
      case "health-emotional":
        return analiticsClinic;
      // "Preza pela saúde e valoriza o atendimento emocional";
      case "health-rational":
        return analiticsClinic;
      default:
        return "Perfil não definido";
    }
  },

  generateAnalytics: (quotes, paidQuotes, dentistFilter) => {
    const filtered =
      dentistFilter === "all"
        ? quotes
        : quotes.filter((q) => q.dentistId === dentistFilter);

    const filteredPaid = filtered.filter((q) => q.status === "paid");

    const getMostCommonProfile = (
      quotes: Quote[]
    ): PatientProfile | undefined => {
      const profileCounts: Record<PatientProfile, number> = {
        "aesthetic-emotional": 0,
        "aesthetic-rational": 0,
        "health-emotional": 0,
        "health-rational": 0,
      };
      quotes.forEach(
        (q) => q.patientProfile && profileCounts[q.patientProfile]++
      );
      return Object.entries(profileCounts).reduce((a, b) =>
        b[1] > a[1] ? b : a
      )[0] as PatientProfile;
    };

    const calculateAvgAge = (quotes: Quote[]) => {
      let total = 0,
        count = 0;
      quotes.forEach((q) => {
        if (q.patientAge) {
          total += q.patientAge;
          count++;
        } else if (
          q.patientBirthdate &&
          typeof q.patientBirthdate === "string"
        ) {
          //@ts-ignore
          const [day, month, year] = q.patientBirthdate.split("/").map(Number);
          const birthDate = new Date(year, month - 1, day);
          total += differenceInYears(new Date(), birthDate);
          count++;
        }
      });
      return count > 0 ? Math.round(total / count) : undefined;
    };

    const relationshipAvg = (quotes: Quote[]): string => {
      const values: Record<Relationship, number> = {
        new: 0,
        sixMonths: 0.5,
        oneYear: 1,
        moreThanYear: 2,
        moreThanThreeYears: 4,
      };
      let total = 0,
        count = 0;
      quotes.forEach((q) => {
        if (q.relationship) {
          total += values[q.relationship];
          count++;
        }
      });
      const avg = count ? total / count : 0;
      if (avg < 0.25) return "Menos de 3 meses";
      if (avg < 0.75) return "3-6 meses";
      if (avg < 1.5) return "6-12 meses";
      if (avg < 3) return "1-3 anos";
      return "Mais de 3 anos";
    };

    const avgTicket = (quotes: Quote[]) => {
      const total = quotes.reduce(
        (sum, q) => sum + q.treatments.reduce((tSum, t) => tSum + t.price, 0),
        0
      );
      return quotes.length ? total / quotes.length : 0;
    };

    const mostCommonTreatment = (quotes: Quote[]) => {
      const count: Record<string, number> = {};
      quotes.forEach((q) =>
        q.treatments.forEach((t) => {
          count[t.name] = (count[t.name] || 0) + 1;
        })
      );
      return Object.entries(count).reduce(
        (a, b) => (b[1] > a[1] ? b : a),
        ["Nenhum", 0]
      )[0];
    };

    const computeTreatmentStats = (
      quotes: Quote[],
      paidQuotes: Quote[]
    ): TreatmentStat[] => {
      const stats: Record<
        string,
        { quoted: number; closed: number; conversion: number }
      > = {};

      quotes.forEach((q) => {
        q.treatments.forEach((t) => {
          if (!stats[t.name]) {
            stats[t.name] = { quoted: 0, closed: 0, conversion: 0 };
          }
          stats[t.name].quoted++;
        });
      });

      paidQuotes.forEach((q) => {
        q.treatments.forEach((t) => {
          if (stats[t.name]) {
            stats[t.name].closed++;
            stats[t.name].conversion =
              (stats[t.name].closed / stats[t.name].quoted) * 100;
          }
        });
      });

      return Object.entries(stats)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.quoted - a.quoted);
    };

    const profileData = (quotes: Quote[]): ProfileData => ({
      psychologicalProfile: getMostCommonProfile(quotes),
      avgAge: calculateAvgAge(quotes),
      relationshipAvg: relationshipAvg(quotes),
      avgTicket: avgTicket(quotes),
      mostCommonTreatment: mostCommonTreatment(quotes),
    });

    const mostCommon = profileData(filtered);
    const bestProfile = profileData(filteredPaid);
    const treatmentStats = computeTreatmentStats(filtered, filteredPaid);

    set({
      mostCommonProfileData: mostCommon,
      bestConversionProfileData: bestProfile,
      suggestions: [
        {
          phrase: `Exemplo de sugestão com base no perfil ${mostCommon.psychologicalProfile}`,
        },
      ],
      treatmentStats,
    });
  },

  generateSuggestionWithIA: async (quotes: Quote[], dentistFilter: string) => {
    const { setSuggestions, setSeggestionsIsLoading } = useAnalytics.getState();
    setSeggestionsIsLoading(true);
    const filtered =
      dentistFilter === "all"
        ? quotes
        : quotes.filter((q) => q.dentistId === dentistFilter);
    const res = await api.post("/suggestions/create", { quotes: filtered });
    setSuggestions(res?.data);
    setSeggestionsIsLoading(false);
    return res.data;
  },
}));
