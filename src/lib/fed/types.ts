export type RateProb = {
  deltaRate: number;
  fromRate: number;
  rate: number;
  prob: number;
};

export type FedData = {
  rateProbs: RateProb[];
  rateProbsTime: number;
  meetingTime: number;
  cacheTime: number;
};
