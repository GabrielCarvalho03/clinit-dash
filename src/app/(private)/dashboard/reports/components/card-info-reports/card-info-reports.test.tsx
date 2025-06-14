import { render } from "@testing-library/react";
import { CardInfoReports } from "./card-info-reports";

describe("CardInfoReports", () => {
  it("should render CardInfoReports correctly", () => {
    const { asFragment } = render(<CardInfoReports title="Test" text="Test" />);

    expect(asFragment()).toMatchSnapshot();
  });
});
