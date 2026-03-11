import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tabs = [
  {
    name: "Overview",
    value: "overview",
    content: (
      <>
        Discover{" "}
        <span className='text-foreground font-semibold'>fresh ideas</span>,
        trending topics, and hidden gems curated just for you. Start exploring
        and let your curiosity lead the way!
      </>
    ),
  },
  {
    name: "Resources",
    value: "resources",
    content: (
      <>
        All your{" "}
        <span className='text-foreground font-semibold'>favorites</span> are
        saved here. Revisit articles, collections, and moments you love, any
        time you want a little inspiration.
      </>
    ),
  },
  {
    name: "Notions",
    value: "notions",
    content: (
      <>
        <span className='text-foreground font-semibold'>Surprise!</span>{" "}
        Here&apos;s something unexpected—a fun fact, a quirky tip, or a daily
        challenge. Come back for a new surprise every day!
      </>
    ),
  },
];

const LessonTabs = () => {
  return (
    <div className='mt-4 w-full'>
      <Tabs defaultValue='overview' className='gap-4'>
        <TabsList className='bg-background flex w-full justify-start rounded-none border-b p-0 text-start'>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className='bg-background data-[state=active]:border-primary dark:data-[state=active]:border-primary h-full rounded-none border-0 border-b-2 border-transparent text-2xl data-[state=active]:shadow-none!'
            >
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <p className='text-muted-foreground text-sm'>{tab.content}</p>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default LessonTabs;
