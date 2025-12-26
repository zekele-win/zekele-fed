export type RateProb = {
  deltaRate: number;
  rate: number;
  prob: number;
};

export type FedData = {
  rateProbs: RateProb[];
  rateProbsTime: number;
  meetingTime: number;
  cacheTime: number;
};
