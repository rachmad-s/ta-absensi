import Page from "../../components/Page/Page";
import PageContent from "../../components/Page/PageContent";
import PageHeader from "../../components/Page/PageHeader";
import TimeOffSetting from "./TimeOffSetting";

export default function SettingPage() {
  return (
    <Page>
      <PageHeader title="Pengaturan" />
      <PageContent>
        <TimeOffSetting />
      </PageContent>
    </Page>
  );
}
