import {
  Bold,
  Calendar as CalendarIcon,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CircleAlert,
  CircleCheck,
  FolderOpen,
  Inbox,
  Info,
  Italic,
  Rocket,
  Search,
  Settings,
  ShieldCheck,
  Smile,
  TriangleAlert,
  Underline,
  User,
} from "lucide-react-native";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";
import { Calendar, type DateRange } from "@/components/ui/calendar";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxValue,
} from "@/components/ui/combobox";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  type Option,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ShadowBox } from "@/components/ui/shadow-box";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/components/ui/sonner";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { Toggle, ToggleIcon } from "@/components/ui/toggle";
import {
  ToggleGroup,
  ToggleGroupIcon,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  TypographyBlockquote,
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyInlineCode,
  TypographyLarge,
  TypographyLead,
  TypographyList,
  TypographyListItem,
  TypographyMuted,
  TypographyP,
  TypographySmall,
} from "@/components/ui/typography";
import { DataTableDemo } from "@/dev/data-table-demo";
import {
  DatePickerBasic,
  DatePickerInput,
  DatePickerRange,
} from "@/dev/date-picker-demo";
import { DirectionDemo } from "@/dev/direction-demo";
import { DrawerDemo } from "@/dev/drawer-demo";
import { PaletteDemo } from "@/dev/palette-demo";
import { TabsDemo } from "@/dev/tabs-demo";
import { reportScreenLayout } from "@/lib/screen-insets";
import { ScrollLockContext } from "@/lib/scroll-lock";

const FRUITS = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry" },
  { value: "grape", label: "Grape" },
  { value: "mango", label: "Mango" },
  { value: "orange", label: "Orange" },
];

const INVOICES = [
  { id: "INV001", status: "Paid", method: "Credit Card", amount: "$250.00" },
  { id: "INV002", status: "Pending", method: "PayPal", amount: "$150.00" },
  {
    id: "INV003",
    status: "Unpaid",
    method: "Bank Transfer",
    amount: "$350.00",
  },
  { id: "INV004", status: "Paid", method: "Credit Card", amount: "$300.00" },
];

const FAQ_ITEMS = [
  {
    value: "item-1",
    question: "What is this?",
    answer:
      "A demo screen for components ported from neobrutalism.com to React Native Reusables.",
  },
  {
    value: "item-2",
    question: "Is it accessible?",
    answer:
      "Yes. It's built on @rn-primitives, which mirrors the same primitives Radix UI uses on web.",
  },
  {
    value: "item-3",
    question: "Is it animated?",
    answer:
      "Yes, via react-native-reanimated — the chevron rotation and panel transition both run natively.",
  },
];

export default function HomeScreen() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [range, setRange] = useState<DateRange | undefined>();
  const [collapsibleOpen, setCollapsibleOpen] = useState(false);
  const [fruit, setFruit] = useState<Option>({
    value: "apple",
    label: "Apple",
  });
  const [fruits, setFruits] = useState<string[]>(["apple"]);
  const [accepted, setAccepted] = useState(true);
  const [subscribed, setSubscribed] = useState(false);
  const [otp, setOtp] = useState("");
  const [page, setPage] = useState(1);
  const [plan, setPlan] = useState("default");
  const [progress, setProgress] = useState(40);
  const [volume, setVolume] = useState([60]);
  const [scrollLocked, setScrollLocked] = useState(false);
  const [airplane, setAirplane] = useState(false);
  const [formats, setFormats] = useState<string[]>(["bold"]);
  const [alignment, setAlignment] = useState<string | undefined>("left");
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(true);
  const [underline, setUnderline] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [lastCommand, setLastCommand] = useState<string>();
  const [showBookmarks, setShowBookmarks] = useState(true);
  const [showUrls, setShowUrls] = useState(false);
  const [person, setPerson] = useState("pedro");
  function runCommand(value: string) {
    setLastCommand(value);
    setCommandOpen(false);
  }
  const commandBody = (
    <>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty />
        <CommandGroup heading="Suggestions">
          <CommandItem onSelect={runCommand} value="Calendar">
            <Icon as={CalendarIcon} size={16} />
            <Text>Calendar</Text>
          </CommandItem>
          <CommandItem onSelect={runCommand} value="Search Emoji">
            <Icon as={Smile} size={16} />
            <Text>Search Emoji</Text>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem onSelect={runCommand} value="Profile">
            <Icon as={User} size={16} />
            <Text>Profile</Text>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={runCommand} value="Settings" checked>
            <Icon as={Settings} size={16} />
            <Text>Settings</Text>
          </CommandItem>
          <CommandItem onSelect={runCommand} value="Billing" disabled>
            <Text>Billing (disabled)</Text>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </>
  );
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollLockContext.Provider value={(locked) => setScrollLocked(locked)}>
        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          scrollEnabled={!scrollLocked}
          onLayout={reportScreenLayout}
        >
          <View className="gap-6 p-4">
            <Text variant="h2">Components</Text>
            <View className="gap-2">
              <Text variant="muted">Accordion</Text>
              <Accordion type="single" collapsible defaultValue="item-1">
                {FAQ_ITEMS.map((item) => (
                  <AccordionItem key={item.value} value={item.value}>
                    <AccordionTrigger>
                      <Text>{item.question}</Text>
                    </AccordionTrigger>
                    <AccordionContent>
                      <Text>{item.answer}</Text>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </View>
            <View className="gap-2">
              <Text variant="muted">Alert</Text>
              <View className="gap-4">
                <Alert icon={Rocket}>
                  <AlertTitle>Heads up</AlertTitle>
                  <AlertDescription>
                    This is the default variant, with an optional icon slot.
                  </AlertDescription>
                </Alert>
                <Alert variant="destructive" icon={CircleAlert}>
                  <AlertTitle>Something broke</AlertTitle>
                  <AlertDescription>
                    The destructive variant for errors that need attention.
                  </AlertDescription>
                </Alert>
                <Alert variant="solid" icon={Info}>
                  <AlertTitle>Solid variant</AlertTitle>
                  <AlertDescription>
                    A Neobrutalism addition on top of shadcn&apos;s variant
                    axis.
                  </AlertDescription>
                </Alert>
                <Alert status="success" icon={CircleCheck}>
                  <AlertTitle>Saved</AlertTitle>
                  <AlertDescription>
                    The status axis overrides the variant&apos;s colors when
                    set.
                  </AlertDescription>
                </Alert>
                <Alert status="warning" icon={TriangleAlert}>
                  <AlertTitle>Careful</AlertTitle>
                  <AlertDescription>
                    Status also supports warning and info, alongside error.
                  </AlertDescription>
                </Alert>
              </View>
            </View>
            <View className="gap-2">
              <Text variant="muted">Alert Dialog</Text>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Text>Delete account</Text>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>
                      <Text>Cancel</Text>
                    </AlertDialogCancel>
                    <AlertDialogAction>
                      <Text>Continue</Text>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </View>
            <View className="gap-2">
              <Text variant="muted">Avatar</Text>
              <View className="gap-4">
                <View className="flex-row items-center gap-4">
                  <Avatar size="sm" alt="Small avatar">
                    <AvatarImage
                      source={{ uri: "https://i.pravatar.cc/150?img=1" }}
                    />
                    <AvatarFallback>
                      <Text>SM</Text>
                    </AvatarFallback>
                  </Avatar>
                  <Avatar alt="Default avatar">
                    <AvatarImage
                      source={{ uri: "https://i.pravatar.cc/150?img=2" }}
                    />
                    <AvatarFallback>
                      <Text>MD</Text>
                    </AvatarFallback>
                  </Avatar>
                  <Avatar size="lg" alt="Large avatar">
                    <AvatarImage
                      source={{ uri: "https://i.pravatar.cc/150?img=3" }}
                    />
                    <AvatarFallback>
                      <Text>LG</Text>
                    </AvatarFallback>
                  </Avatar>
                  <Avatar alt="Avatar with online badge">
                    <AvatarFallback>
                      <Text>RZ</Text>
                    </AvatarFallback>
                    <AvatarBadge>
                      <Icon
                        as={Check}
                        size={8}
                        className="text-primary-foreground"
                      />
                    </AvatarBadge>
                  </Avatar>
                </View>
                <AvatarGroup>
                  <Avatar alt="Team member A">
                    <AvatarImage
                      source={{ uri: "https://i.pravatar.cc/150?img=4" }}
                    />
                    <AvatarFallback>
                      <Text>A</Text>
                    </AvatarFallback>
                  </Avatar>
                  <Avatar alt="Team member B">
                    <AvatarImage
                      source={{ uri: "https://i.pravatar.cc/150?img=5" }}
                    />
                    <AvatarFallback>
                      <Text>B</Text>
                    </AvatarFallback>
                  </Avatar>
                  <Avatar alt="Team member C">
                    <AvatarImage
                      source={{ uri: "https://i.pravatar.cc/150?img=6" }}
                    />
                    <AvatarFallback>
                      <Text>C</Text>
                    </AvatarFallback>
                  </Avatar>
                  <AvatarGroupCount>
                    <Text>+3</Text>
                  </AvatarGroupCount>
                </AvatarGroup>
              </View>
            </View>
            <View className="gap-2">
              <Text variant="muted">Breadcrumb</Text>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink>
                      <Text>Home</Text>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbEllipsis />
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink>
                      <Text>Components</Text>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </View>
            <View className="gap-2">
              <Text variant="muted">Context Menu</Text>
              <ContextMenu>
                <ContextMenuTrigger>
                  <View className="h-32 items-center justify-center rounded-md border-2 border-dashed border-border bg-card">
                    <Text>Long press (right click on web) here</Text>
                  </View>
                </ContextMenuTrigger>
                <ContextMenuContent className="w-64">
                  <ContextMenuItem>
                    <Text>Back</Text>
                    <ContextMenuShortcut>⌘[</ContextMenuShortcut>
                  </ContextMenuItem>
                  <ContextMenuItem disabled>
                    <Text>Forward</Text>
                    <ContextMenuShortcut>⌘]</ContextMenuShortcut>
                  </ContextMenuItem>
                  <ContextMenuItem>
                    <Text>Reload</Text>
                    <ContextMenuShortcut>⌘R</ContextMenuShortcut>
                  </ContextMenuItem>
                  <ContextMenuSub>
                    <ContextMenuSubTrigger>
                      <Text>More Tools</Text>
                    </ContextMenuSubTrigger>
                    <ContextMenuSubContent>
                      <ContextMenuItem>
                        <Text>Save Page...</Text>
                      </ContextMenuItem>
                      <ContextMenuItem>
                        <Text>Developer Tools</Text>
                      </ContextMenuItem>
                      <ContextMenuSeparator />
                      <ContextMenuItem variant="destructive">
                        <Text>Delete</Text>
                      </ContextMenuItem>
                    </ContextMenuSubContent>
                  </ContextMenuSub>
                  <ContextMenuSeparator />
                  <ContextMenuCheckboxItem
                    checked={showBookmarks}
                    onCheckedChange={setShowBookmarks}
                  >
                    <Text>Show Bookmarks</Text>
                  </ContextMenuCheckboxItem>
                  <ContextMenuCheckboxItem
                    checked={showUrls}
                    onCheckedChange={setShowUrls}
                  >
                    <Text>Show Full URLs</Text>
                  </ContextMenuCheckboxItem>
                  <ContextMenuSeparator />
                  <ContextMenuGroup>
                    <ContextMenuLabel>People</ContextMenuLabel>
                    <ContextMenuRadioGroup
                      value={person}
                      onValueChange={setPerson}
                    >
                      <ContextMenuRadioItem value="pedro">
                        <Text>Pedro Duarte</Text>
                      </ContextMenuRadioItem>
                      <ContextMenuRadioItem value="colm">
                        <Text>Colm Tuite</Text>
                      </ContextMenuRadioItem>
                    </ContextMenuRadioGroup>
                  </ContextMenuGroup>
                </ContextMenuContent>
              </ContextMenu>
            </View>
            <View className="gap-2">
              <Text variant="muted">Command</Text>
              <View className="gap-4">
                <Command>{commandBody}</Command>
                <View className="flex-row items-center gap-3">
                  <Button
                    variant="outline"
                    onPress={() => setCommandOpen(true)}
                  >
                    <Text>Open command dialog</Text>
                  </Button>
                  <Text variant="muted">
                    {lastCommand ?? "Nothing selected"}
                  </Text>
                </View>
                <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
                  <Command shadow={false} className="border-0">
                    {commandBody}
                  </Command>
                </CommandDialog>
              </View>
            </View>
            <View className="gap-2">
              <Text variant="muted">Direction</Text>
              <DirectionDemo />
            </View>
            <View className="gap-2">
              <Text variant="muted">Drawer</Text>
              <DrawerDemo />
            </View>
            <View className="gap-2">
              <Text variant="muted">Hover Card</Text>
              <View className="flex-row">
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button variant="link">
                      <Text>@nativewind</Text>
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent align="start">
                    <View className="flex-row gap-3">
                      <Avatar alt="NativeWind">
                        <AvatarImage
                          source={{ uri: "https://i.pravatar.cc/150?img=8" }}
                        />
                        <AvatarFallback>
                          <Text>NW</Text>
                        </AvatarFallback>
                      </Avatar>
                      <View className="flex-1 gap-1">
                        <Text className="font-head text-sm font-medium">
                          @nativewind
                        </Text>
                        <Text variant="muted">
                          Tailwind CSS for React Native. Joined December 2021.
                        </Text>
                      </View>
                    </View>
                  </HoverCardContent>
                </HoverCard>
              </View>
            </View>
            <View className="gap-2">
              <Text variant="muted">Field</Text>
              <FieldSet>
                <FieldLegend>Account</FieldLegend>
                <FieldDescription>
                  Fill in your details to create an account.
                </FieldDescription>
                <FieldGroup>
                  <Field>
                    <FieldLabel>Email</FieldLabel>
                    <Input
                      placeholder="m@example.com"
                      keyboardType="email-address"
                    />
                    <FieldDescription>
                      We&apos;ll never share your email.
                    </FieldDescription>
                  </Field>
                  <Field invalid>
                    <FieldLabel>Username</FieldLabel>
                    <Input placeholder="username" invalid />
                    <FieldError
                      errors={[{ message: "Username is already taken." }]}
                    />
                  </Field>
                  <FieldSeparator>Or continue with</FieldSeparator>
                  <Field orientation="horizontal">
                    <Checkbox
                      checked={accepted}
                      onCheckedChange={setAccepted}
                    />
                    <FieldContent>
                      <FieldTitle>Accept terms</FieldTitle>
                      <FieldDescription>
                        You agree to our Terms of Service and Privacy Policy.
                      </FieldDescription>
                    </FieldContent>
                  </Field>
                </FieldGroup>
              </FieldSet>
            </View>
            <View className="gap-2">
              <Text variant="muted">Empty</Text>
              <View className="gap-4">
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <Icon as={FolderOpen} size={16} />
                    </EmptyMedia>
                    <EmptyTitle>No projects yet</EmptyTitle>
                    <EmptyDescription>
                      You haven&apos;t created any projects yet. Get started by
                      creating your first project.
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <Button>
                      <Text>Create project</Text>
                    </Button>
                  </EmptyContent>
                </Empty>
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia>
                      <Icon as={Inbox} size={32} />
                    </EmptyMedia>
                    <EmptyTitle>Inbox zero</EmptyTitle>
                    <EmptyDescription>
                      Nothing to see here. New messages will show up as they
                      arrive.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              </View>
            </View>
            <View className="gap-2">
              <Text variant="muted">Dropdown Menu</Text>
              <View className="flex-row">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Text>Open menu</Text>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Text>Profile</Text>
                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Text>Billing</Text>
                        <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuItem disabled>
                        <Text>Settings</Text>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          <Text>Invite users</Text>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem>
                            <Text>Email</Text>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Text>Message</Text>
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={showBookmarks}
                      onCheckedChange={setShowBookmarks}
                    >
                      <Text>Show Bookmarks</Text>
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
                    <DropdownMenuRadioGroup
                      value={person}
                      onValueChange={setPerson}
                    >
                      <DropdownMenuRadioItem value="pedro">
                        <Text>Pedro Duarte</Text>
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="colm">
                        <Text>Colm Tuite</Text>
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">
                      <Text>Log out</Text>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </View>
            </View>
            <View className="gap-2">
              <Text variant="muted">Dialog</Text>
              <View className="flex-row">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Text>Edit profile</Text>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit profile</DialogTitle>
                      <DialogDescription>
                        Make changes to your profile here. Click save when
                        you&apos;re done.
                      </DialogDescription>
                    </DialogHeader>
                    <View className="gap-3">
                      <Input placeholder="Name" />
                      <Input placeholder="Username" />
                    </View>
                    <DialogFooter showCloseButton>
                      <Button>
                        <Text>Save changes</Text>
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </View>
            </View>
            <View className="gap-2">
              <Text variant="muted">Date Picker</Text>
              <View className="gap-4">
                <DatePickerBasic />
                <DatePickerRange />
                <DatePickerInput />
              </View>
            </View>
            <View className="gap-2">
              <Text variant="muted">Toggle</Text>
              <View className="flex-row flex-wrap items-center gap-4">
                <Toggle
                  aria-label="Toggle bold"
                  pressed={bold}
                  onPressedChange={setBold}
                >
                  <ToggleIcon as={Bold} size={16} />
                </Toggle>
                <Toggle
                  size="sm"
                  aria-label="Toggle italic"
                  pressed={italic}
                  onPressedChange={setItalic}
                >
                  <ToggleIcon as={Italic} size={16} />
                  <Text>Italic</Text>
                </Toggle>
                <Toggle
                  size="lg"
                  variant="outline"
                  aria-label="Toggle underline"
                  pressed={underline}
                  onPressedChange={setUnderline}
                >
                  <ToggleIcon as={Underline} size={16} />
                  <Text>Underline</Text>
                </Toggle>
                <Toggle
                  disabled
                  aria-label="Disabled"
                  pressed={false}
                  onPressedChange={() => {}}
                >
                  <Text>Disabled</Text>
                </Toggle>
              </View>
            </View>
            <View className="gap-2">
              <Text variant="muted">Toggle Group</Text>
              <View className="gap-4">
                <ToggleGroup
                  type="multiple"
                  value={formats}
                  onValueChange={setFormats}
                >
                  <ToggleGroupItem value="bold" aria-label="Toggle bold">
                    <ToggleGroupIcon as={Bold} size={16} />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="italic" aria-label="Toggle italic">
                    <ToggleGroupIcon as={Italic} size={16} />
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="underline"
                    aria-label="Toggle underline"
                  >
                    <ToggleGroupIcon as={Underline} size={16} />
                  </ToggleGroupItem>
                </ToggleGroup>
                <ToggleGroup
                  type="single"
                  spacing={0}
                  value={alignment}
                  onValueChange={setAlignment}
                >
                  <ToggleGroupItem value="left">
                    <Text>Left</Text>
                  </ToggleGroupItem>
                  <ToggleGroupItem value="center">
                    <Text>Center</Text>
                  </ToggleGroupItem>
                  <ToggleGroupItem value="right">
                    <Text>Right</Text>
                  </ToggleGroupItem>
                </ToggleGroup>
                <ToggleGroup
                  type="single"
                  spacing={0}
                  orientation="vertical"
                  value={alignment}
                  onValueChange={setAlignment}
                >
                  <ToggleGroupItem value="left">
                    <Text>Left</Text>
                  </ToggleGroupItem>
                  <ToggleGroupItem value="center">
                    <Text>Center</Text>
                  </ToggleGroupItem>
                  <ToggleGroupItem value="right" disabled>
                    <Text>Right</Text>
                  </ToggleGroupItem>
                </ToggleGroup>
              </View>
            </View>
            <View className="gap-2">
              <Text variant="muted">Tooltip</Text>
              <View className="flex-row flex-wrap gap-3">
                {(["top", "bottom"] as const).map((side) => (
                  <Tooltip key={side}>
                    <TooltipTrigger asChild>
                      <Button variant="outline">
                        <Text className="capitalize">{side}</Text>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side={side}>
                      <Text>Add to library</Text>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </View>
              <Text variant="muted">
                Long press a button to show the tooltip.
              </Text>
            </View>
            <View className="gap-2">
              <Text variant="muted">Tabs</Text>
              <TabsDemo />
            </View>
            <View className="gap-2">
              <Text variant="muted">Table</Text>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="items-end">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {INVOICES.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>{invoice.id}</TableCell>
                      <TableCell>{invoice.status}</TableCell>
                      <TableCell>{invoice.method}</TableCell>
                      <TableCell className="items-end">
                        {invoice.amount}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow className="border-b-0">
                    <TableCell>Total</TableCell>
                    <TableCell />
                    <TableCell />
                    <TableCell className="items-end">$1,050.00</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
              <TableCaption>A list of your recent invoices.</TableCaption>
            </View>
            <View className="gap-2">
              <Text variant="muted">Data Table</Text>
              <DataTableDemo />
            </View>
            <View className="gap-2">
              <Text variant="muted">Menubar</Text>
              <Menubar>
                <MenubarMenu value="file">
                  <MenubarTrigger>
                    <Text>File</Text>
                  </MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem>
                      <Text>New Tab</Text>
                      <MenubarShortcut>⌘T</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem disabled>
                      <Text>New Window</Text>
                      <MenubarShortcut>⌘N</MenubarShortcut>
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarSub>
                      <MenubarSubTrigger>
                        <Text>Share</Text>
                      </MenubarSubTrigger>
                      <MenubarSubContent>
                        <MenubarItem>
                          <Text>Email link</Text>
                        </MenubarItem>
                        <MenubarItem>
                          <Text>Messages</Text>
                        </MenubarItem>
                      </MenubarSubContent>
                    </MenubarSub>
                    <MenubarSeparator />
                    <MenubarItem variant="destructive">
                      <Text>Quit</Text>
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
                <MenubarMenu value="view">
                  <MenubarTrigger>
                    <Text>View</Text>
                  </MenubarTrigger>
                  <MenubarContent>
                    <MenubarCheckboxItem
                      checked={showBookmarks}
                      onCheckedChange={setShowBookmarks}
                    >
                      <Text>Always Show Bookmarks</Text>
                    </MenubarCheckboxItem>
                    <MenubarCheckboxItem
                      checked={showUrls}
                      onCheckedChange={setShowUrls}
                    >
                      <Text>Always Show Full URLs</Text>
                    </MenubarCheckboxItem>
                  </MenubarContent>
                </MenubarMenu>
                <MenubarMenu value="profiles">
                  <MenubarTrigger>
                    <Text>Profiles</Text>
                  </MenubarTrigger>
                  <MenubarContent>
                    <MenubarRadioGroup value={person} onValueChange={setPerson}>
                      <MenubarRadioItem value="pedro">
                        <Text>Pedro Duarte</Text>
                      </MenubarRadioItem>
                      <MenubarRadioItem value="colm">
                        <Text>Colm Tuite</Text>
                      </MenubarRadioItem>
                    </MenubarRadioGroup>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            </View>
            <View className="gap-2">
              <Text variant="muted">Kbd</Text>
              <View className="gap-4">
                <KbdGroup>
                  <Kbd>⌘</Kbd>
                  <Kbd>⇧</Kbd>
                  <Kbd>⌥</Kbd>
                  <Kbd>⌃</Kbd>
                </KbdGroup>
                <View className="flex-row items-center gap-2">
                  <Text>Use</Text>
                  <KbdGroup>
                    <Kbd>Ctrl</Kbd>
                    <Text className="text-muted-foreground">+</Text>
                    <Kbd>B</Kbd>
                  </KbdGroup>
                  <Text>to toggle the sidebar.</Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Kbd>
                    <Icon as={ChevronRight} size={12} />
                  </Kbd>
                  <Kbd>Enter</Kbd>
                </View>
              </View>
            </View>
            <View className="gap-2">
              <Text variant="muted">Item</Text>
              <ItemGroup>
                <Item variant="outline">
                  <ItemMedia variant="icon">
                    <Icon as={ShieldCheck} size={20} />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>Security alert</ItemTitle>
                    <ItemDescription>
                      New login detected from an unknown device.
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Button size="sm" variant="outline">
                      <Text>Review</Text>
                    </Button>
                  </ItemActions>
                </Item>
                <Item variant="muted">
                  <ItemMedia variant="image">
                    <Avatar alt="Shadcn">
                      <AvatarImage
                        source={{ uri: "https://i.pravatar.cc/150?img=12" }}
                      />
                      <AvatarFallback>
                        <Text>SC</Text>
                      </AvatarFallback>
                    </Avatar>
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>Muted item</ItemTitle>
                    <ItemDescription>
                      Subtle background, no border.
                    </ItemDescription>
                  </ItemContent>
                </Item>
                <ItemSeparator />
                <Item onPress={() => setLastCommand("Item pressed")}>
                  <ItemContent>
                    <ItemTitle>Pressable item</ItemTitle>
                    <ItemDescription>Tap to select it.</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Icon as={ChevronRight} size={16} />
                  </ItemActions>
                </Item>
              </ItemGroup>
            </View>
            <View className="gap-2">
              <Text variant="muted">Input OTP</Text>
              <View className="gap-4">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                <Text variant="muted">
                  {otp === ""
                    ? "Enter your one-time password."
                    : `You entered: ${otp}`}
                </Text>
                <InputOTP maxLength={4} invalid>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                </InputOTP>
              </View>
            </View>
            <View className="gap-2">
              <Text variant="muted">Textarea</Text>
              <View className="gap-4">
                <Textarea placeholder="Type your message here." />
                <Textarea placeholder="Invalid" invalid />
                <Textarea placeholder="Disabled" editable={false} />
              </View>
            </View>
            <View className="gap-2">
              <Text variant="muted">Input Group</Text>
              <View className="gap-4">
                <InputGroup>
                  <InputGroupAddon>
                    <Icon
                      as={Search}
                      size={16}
                      className="text-muted-foreground"
                    />
                  </InputGroupAddon>
                  <InputGroupInput placeholder="Search..." />
                  <InputGroupAddon align="inline-end">
                    <InputGroupText>12 results</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                <InputGroup>
                  <InputGroupAddon>
                    <InputGroupText>https://</InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput
                    placeholder="example"
                    autoCapitalize="none"
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupText>.com</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                <InputGroup>
                  <InputGroupInput placeholder="Copy this value" />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton variant="outline">
                      <Text>Copy</Text>
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                <InputGroup invalid>
                  <InputGroupInput placeholder="Invalid" />
                </InputGroup>
                <InputGroup>
                  <InputGroupTextarea placeholder="Write a message..." />
                  <InputGroupAddon align="block-end">
                    <InputGroupText>0 / 280</InputGroupText>
                    <InputGroupButton variant="default">
                      <Text>Send</Text>
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </View>
            </View>
            <View className="gap-2">
              <Text variant="muted">Input</Text>
              <View className="gap-4">
                <Input placeholder="Email" keyboardType="email-address" />
                <Input placeholder="Invalid" invalid />
                <Input placeholder="Disabled" editable={false} />
              </View>
            </View>
            <View className="gap-2">
              <Text variant="muted">Pagination</Text>
              <View className="gap-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        disabled={page === 1}
                        onPress={() => setPage((p) => Math.max(1, p - 1))}
                      />
                    </PaginationItem>
                    {[1, 2, 3].map((n) => (
                      <PaginationItem key={n}>
                        <PaginationLink
                          isActive={page === n}
                          onPress={() => setPage(n)}
                        >
                          <Text>{n}</Text>
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext
                        disabled={page === 3}
                        onPress={() => setPage((p) => Math.min(3, p + 1))}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </View>
            </View>
            <View className="gap-2">
              <Text variant="muted">Popover</Text>
              <View className="flex-row">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      <Text>Open popover</Text>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start">
                    <PopoverHeader>
                      <PopoverTitle>Dimensions</PopoverTitle>
                      <PopoverDescription>
                        Set the dimensions for the layer.
                      </PopoverDescription>
                    </PopoverHeader>
                    <Input placeholder="Width" />
                    <Input placeholder="Height" />
                  </PopoverContent>
                </Popover>
              </View>
            </View>
            <View className="gap-2">
              <Text variant="muted">Progress</Text>
              <View className="gap-4">
                <Progress value={progress} />
                <View className="flex-row items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onPress={() => setProgress((p) => Math.max(0, p - 20))}
                  >
                    <Text>-20</Text>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onPress={() => setProgress((p) => Math.min(100, p + 20))}
                  >
                    <Text>+20</Text>
                  </Button>
                  <Text variant="muted">{`${progress}%`}</Text>
                </View>
              </View>
            </View>
            <View className="gap-2">
              <Text variant="muted">Radio Group</Text>
              <RadioGroup value={plan} onValueChange={setPlan}>
                <View className="flex-row items-center gap-3">
                  <RadioGroupItem
                    value="default"
                    aria-labelledby="plan-default"
                  />
                  <Text nativeID="plan-default">Default</Text>
                </View>
                <View className="flex-row items-center gap-3">
                  <RadioGroupItem
                    value="comfortable"
                    aria-labelledby="plan-comfortable"
                  />
                  <Text nativeID="plan-comfortable">Comfortable</Text>
                </View>
                <View className="flex-row items-center gap-3">
                  <RadioGroupItem
                    value="compact"
                    aria-labelledby="plan-compact"
                  />
                  <Text nativeID="plan-compact">Compact</Text>
                </View>
                <View className="flex-row items-center gap-3">
                  <RadioGroupItem
                    value="disabled"
                    disabled
                    aria-labelledby="plan-disabled"
                  />
                  <Text nativeID="plan-disabled">Disabled</Text>
                </View>
              </RadioGroup>
            </View>
            <View className="gap-2">
              <Text variant="muted">Separator</Text>
              <View className="gap-4">
                <View className="gap-1">
                  <Text className="font-head font-medium">satuwaktu</Text>
                  <Text variant="muted">An open-source UI kit for mobile.</Text>
                </View>
                <Separator />
                <View className="h-5 flex-row items-center gap-4">
                  <Text>Blog</Text>
                  <Separator orientation="vertical" />
                  <Text>Docs</Text>
                  <Separator orientation="vertical" />
                  <Text>Source</Text>
                </View>
              </View>
            </View>
            <View className="gap-2">
              <Text variant="muted">Slider</Text>
              <View className="gap-4">
                <Slider value={volume} onValueChange={setVolume} max={100} />
                <Text variant="muted">{`Volume: ${volume[0]}`}</Text>
                <Slider defaultValue={[25, 75]} step={5} />
                <Slider defaultValue={[50]} disabled />
              </View>
            </View>
            <View className="gap-2">
              <Text variant="muted">Switch</Text>
              <View className="gap-4">
                <View className="flex-row items-center gap-3">
                  <Switch checked={airplane} onCheckedChange={setAirplane} />
                  <Text>Airplane mode</Text>
                </View>
                <View className="flex-row items-center gap-3">
                  <Switch
                    size="sm"
                    checked={subscribed}
                    onCheckedChange={setSubscribed}
                  />
                  <Text>Small</Text>
                </View>
                <View className="flex-row items-center gap-3">
                  <Switch checked disabled onCheckedChange={() => {}} />
                  <Text>Disabled</Text>
                </View>
              </View>
            </View>
            <View className="gap-2">
              <Text variant="muted">Sonner</Text>
              <View className="flex-row flex-wrap gap-3">
                <Button
                  variant="outline"
                  onPress={() =>
                    toast("Event created", {
                      description: "Sunday, December 03, 2023 at 9:00 AM",
                      action: { label: "Undo" },
                    })
                  }
                >
                  <Text>Default</Text>
                </Button>
                <Button
                  variant="outline"
                  onPress={() => toast.success("Profile saved")}
                >
                  <Text>Success</Text>
                </Button>
                <Button
                  variant="outline"
                  onPress={() => toast.info("New update available")}
                >
                  <Text>Info</Text>
                </Button>
                <Button
                  variant="outline"
                  onPress={() => toast.warning("Storage almost full")}
                >
                  <Text>Warning</Text>
                </Button>
                <Button
                  variant="outline"
                  onPress={() =>
                    toast.error("Something went wrong", {
                      description: "Please try again later.",
                      cancel: { label: "Dismiss" },
                    })
                  }
                >
                  <Text>Error</Text>
                </Button>
                <Button
                  variant="outline"
                  onPress={() => {
                    const id = toast.loading("Uploading...");
                    setTimeout(
                      () => toast.success("Upload complete", { id }),
                      2000,
                    );
                  }}
                >
                  <Text>Loading</Text>
                </Button>
              </View>
            </View>
            <View className="gap-2">
              <Text variant="muted">Spinner</Text>
              <View className="gap-4">
                <View className="flex-row items-center gap-4">
                  <Spinner />
                  <Spinner size={24} />
                  <Spinner size={32} className="text-primary" />
                  <Spinner size={32} className="text-destructive" />
                </View>
                <View className="flex-row flex-wrap items-center gap-3">
                  <Button disabled>
                    <Spinner />
                    <Text>Please wait</Text>
                  </Button>
                  <Button variant="outline" disabled>
                    <Spinner />
                    <Text>Loading</Text>
                  </Button>
                </View>
              </View>
            </View>
            <View className="gap-2">
              <Text variant="muted">Skeleton</Text>
              <View className="gap-4">
                <View className="flex-row items-center gap-4">
                  <Skeleton className="size-12 rounded-full" />
                  <View className="flex-1 gap-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                  </View>
                </View>
                <Skeleton className="h-32 w-full" />
              </View>
            </View>
            <View className="gap-2">
              <Text variant="muted">Sheet</Text>
              <View className="flex-row flex-wrap gap-3">
                {(["top", "right", "bottom", "left"] as const).map((side) => (
                  <Sheet key={side}>
                    <SheetTrigger asChild>
                      <Button variant="outline">
                        <Text className="capitalize">{side}</Text>
                      </Button>
                    </SheetTrigger>
                    <SheetContent side={side}>
                      <SheetHeader>
                        <SheetTitle>Edit profile</SheetTitle>
                        <SheetDescription>
                          Make changes to your profile here. Click save when
                          you&apos;re done.
                        </SheetDescription>
                      </SheetHeader>
                      <View className="gap-3 px-4">
                        <Input placeholder="Name" />
                        <Input placeholder="Username" />
                      </View>
                      <SheetFooter>
                        <Button>
                          <Text>Save changes</Text>
                        </Button>
                        <SheetClose asChild>
                          <Button variant="outline">
                            <Text>Close</Text>
                          </Button>
                        </SheetClose>
                      </SheetFooter>
                    </SheetContent>
                  </Sheet>
                ))}
              </View>
            </View>
            <View className="gap-2">
              <Text variant="muted">Scroll Area</Text>
              <View className="gap-4">
                <ScrollArea className="h-48 w-full rounded-md border-2 border-border bg-card">
                  <View className="p-4">
                    <Text className="mb-4 font-head font-medium">Tags</Text>
                    {Array.from({ length: 30 }, (_, i) => (
                      <View key={i}>
                        <Text className="text-sm">{`v1.2.0-beta.${30 - i}`}</Text>
                        <Separator className="my-2" />
                      </View>
                    ))}
                  </View>
                </ScrollArea>
                <ScrollArea
                  orientation="horizontal"
                  className="w-full rounded-md border-2 border-border bg-card"
                  contentClassName="gap-4 p-4"
                >
                  {FRUITS.map((item) => (
                    <ShadowBox
                      key={item.value}
                      size="md"
                      contentClassName="h-24 w-32 items-center justify-center rounded-md border-2 border-border bg-secondary"
                    >
                      <Text className="font-head">{item.label}</Text>
                    </ShadowBox>
                  ))}
                </ScrollArea>
              </View>
            </View>
            <View className="gap-2">
              <Text variant="muted">Select</Text>
              <Select
                value={fruit}
                onValueChange={(option) => option && setFruit(option)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Fruits</SelectLabel>
                    {FRUITS.map((item) => (
                      <SelectItem
                        key={item.value}
                        value={item.value}
                        label={item.label}
                      >
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </View>
            <View className="gap-2">
              <Text variant="muted">Combobox</Text>
              <View className="gap-4">
                <Combobox>
                  <ComboboxInput placeholder="Select a fruit" showClear />
                  <ComboboxContent>
                    <ComboboxList>
                      <ComboboxEmpty />
                      <ComboboxGroup>
                        <ComboboxLabel>Fruits</ComboboxLabel>
                        {FRUITS.map((fruit) => (
                          <ComboboxItem
                            key={fruit.value}
                            value={fruit.value}
                            label={fruit.label}
                          >
                            {fruit.label}
                          </ComboboxItem>
                        ))}
                      </ComboboxGroup>
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
                <Combobox multiple value={fruits} onValueChange={setFruits}>
                  <ComboboxChips>
                    <ComboboxValue>
                      {(values) =>
                        values.map((value) => (
                          <ComboboxChip key={value} value={value}>
                            {
                              FRUITS.find((fruit) => fruit.value === value)
                                ?.label
                            }
                          </ComboboxChip>
                        ))
                      }
                    </ComboboxValue>
                    <ComboboxChipsInput placeholder="Add fruit" />
                  </ComboboxChips>
                  <ComboboxContent>
                    <ComboboxList>
                      <ComboboxEmpty />
                      {FRUITS.map((fruit) => (
                        <ComboboxItem
                          key={fruit.value}
                          value={fruit.value}
                          label={fruit.label}
                        >
                          {fruit.label}
                        </ComboboxItem>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </View>
            </View>
            <View className="gap-2">
              <Text variant="muted">Collapsible</Text>
              <Collapsible
                open={collapsibleOpen}
                onOpenChange={setCollapsibleOpen}
                className="gap-4"
              >
                <View className="flex-row items-center justify-between gap-4">
                  <Text className="font-head">3 starred repositories</Text>
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" size="icon-sm">
                      <Icon
                        as={collapsibleOpen ? ChevronUp : ChevronDown}
                        size={16}
                      />
                    </Button>
                  </CollapsibleTrigger>
                </View>
                <ShadowBox
                  size="md"
                  contentClassName="rounded-md border-2 border-border bg-card px-4 py-2"
                >
                  <Text>@rn-primitives/collapsible</Text>
                </ShadowBox>
                <CollapsibleContent>
                  <View style={{ gap: 16, paddingRight: 4, paddingBottom: 4 }}>
                    <ShadowBox
                      size="md"
                      contentClassName="rounded-md border-2 border-border bg-card px-4 py-2"
                    >
                      <Text>@rn-primitives/accordion</Text>
                    </ShadowBox>
                    <ShadowBox
                      size="md"
                      contentClassName="rounded-md border-2 border-border bg-card px-4 py-2"
                    >
                      <Text>@rn-primitives/tabs</Text>
                    </ShadowBox>
                  </View>
                </CollapsibleContent>
              </Collapsible>
            </View>
            <View className="gap-2">
              <Text variant="muted">Checkbox</Text>
              <View className="gap-4">
                <View className="flex-row items-center gap-3">
                  <Checkbox checked={accepted} onCheckedChange={setAccepted} />
                  <Text>Accept terms and conditions</Text>
                </View>
                <View className="flex-row items-center gap-3">
                  <Checkbox
                    checked={subscribed}
                    onCheckedChange={setSubscribed}
                  />
                  <Text>Subscribe to the newsletter</Text>
                </View>
                <View className="flex-row items-center gap-3">
                  <Checkbox
                    checked={false}
                    disabled
                    onCheckedChange={() => {}}
                  />
                  <Text>Disabled</Text>
                </View>
              </View>
            </View>
            <View className="gap-2">
              <Text variant="muted">Carousel</Text>
              <View className="gap-4">
                <Carousel>
                  <CarouselContent>
                    {[1, 2, 3, 4, 5].map((slide) => (
                      <CarouselItem
                        key={slide}
                        className="items-center justify-center"
                      >
                        <Text className="font-head text-5xl">{slide}</Text>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
                <Carousel orientation="vertical" className="w-48">
                  <CarouselContent>
                    {[1, 2, 3].map((slide) => (
                      <CarouselItem
                        key={slide}
                        className="items-center justify-center"
                      >
                        <Text className="font-head text-5xl">{slide}</Text>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </View>
            </View>
            <View className="gap-2">
              <Text variant="muted">Card</Text>
              <View className="gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Project update</CardTitle>
                    <CardDescription>
                      Weekly summary for the mobile team.
                    </CardDescription>
                    <CardAction>
                      <Button variant="outline" size="sm">
                        <Text>View</Text>
                      </Button>
                    </CardAction>
                  </CardHeader>
                  <CardContent>
                    <Text>
                      Ported the UI kit components from neobrutalism.com to
                      React Native Reusables.
                    </Text>
                  </CardContent>
                  <CardFooter className="justify-end gap-2">
                    <Button variant="outline" size="sm">
                      <Text>Cancel</Text>
                    </Button>
                    <Button size="sm">
                      <Text>Save</Text>
                    </Button>
                  </CardFooter>
                </Card>
                <Card size="sm">
                  <CardHeader>
                    <CardTitle>Small card</CardTitle>
                    <CardDescription>
                      Tighter spacing, no footer.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Text>Content goes here.</Text>
                  </CardContent>
                </Card>
              </View>
            </View>
            <View className="gap-2">
              <Text variant="muted">Calendar</Text>
              <View className="gap-4">
                <Calendar mode="single" selected={date} onSelect={setDate} />
                <Calendar mode="range" selected={range} onSelect={setRange} />
              </View>
            </View>
            <View className="gap-2">
              <Text variant="muted">Button Group</Text>
              <View className="gap-4">
                <ButtonGroup>
                  <Button variant="outline">
                    <Text>Left</Text>
                  </Button>
                  <Button variant="outline">
                    <Text>Middle</Text>
                  </Button>
                  <Button variant="outline">
                    <Text>Right</Text>
                  </Button>
                </ButtonGroup>
                <ButtonGroup orientation="vertical">
                  <Button>
                    <Text>Top</Text>
                  </Button>
                  <Button>
                    <Text>Center</Text>
                  </Button>
                  <Button>
                    <Text>Bottom</Text>
                  </Button>
                </ButtonGroup>
                <ButtonGroup>
                  <ButtonGroupText>
                    <Text>Label</Text>
                  </ButtonGroupText>
                  <Button variant="secondary">
                    <Text>Action</Text>
                  </Button>
                </ButtonGroup>
                <ButtonGroup>
                  <ButtonGroup>
                    <Button variant="outline">
                      <Text>Edit</Text>
                    </Button>
                    <Button variant="outline">
                      <Text>Copy</Text>
                    </Button>
                  </ButtonGroup>
                  <ButtonGroup>
                    <Button variant="destructive">
                      <Text>Delete</Text>
                    </Button>
                  </ButtonGroup>
                </ButtonGroup>
              </View>
            </View>
            <View className="gap-2">
              <Text variant="muted">Typography H1</Text>
              <TypographyH1>
                Taxing Laughter: The Joke Tax Chronicles
              </TypographyH1>
            </View>
            <View className="gap-2">
              <Text variant="muted">Typography H2</Text>
              <TypographyH2>The People of the Kingdom</TypographyH2>
            </View>
            <View className="gap-2">
              <Text variant="muted">Typography H3</Text>
              <TypographyH3>The Joke Tax</TypographyH3>
            </View>
            <View className="gap-2">
              <Text variant="muted">Typography H4</Text>
              <TypographyH4>People stopped telling jokes</TypographyH4>
            </View>
            <View className="gap-2">
              <Text variant="muted">Typography P</Text>
              <TypographyP className="mt-0">
                The king, seeing how much happier his subjects were, realized
                the error of his ways and repealed the joke tax.
              </TypographyP>
            </View>
            <View className="gap-2">
              <Text variant="muted">Typography Blockquote</Text>
              <TypographyBlockquote className="mt-0">
                &quot;After all,&quot; he said, &quot;everyone enjoys a good
                joke, so it&apos;s only fair that they should pay for the
                privilege.&quot;
              </TypographyBlockquote>
            </View>
            <View className="gap-2">
              <Text variant="muted">Typography List</Text>
              <TypographyList className="my-0">
                <TypographyListItem>
                  1st level of puns: 5 gold coins
                </TypographyListItem>
                <TypographyListItem>
                  2nd level of jokes: 10 gold coins
                </TypographyListItem>
                <TypographyListItem>
                  3rd level of one-liners : 20 gold coins
                </TypographyListItem>
              </TypographyList>
            </View>
            <View className="gap-2">
              <Text variant="muted">Typography Inline Code</Text>
              <TypographyInlineCode className="self-start">
                @radix-ui/react-alert-dialog
              </TypographyInlineCode>
            </View>
            <View className="gap-2">
              <Text variant="muted">Typography Large</Text>
              <TypographyLarge>Are you absolutely sure?</TypographyLarge>
            </View>
            <View className="gap-2">
              <Text variant="muted">Typography Small</Text>
              <TypographySmall>Email address</TypographySmall>
            </View>
            <View className="gap-2">
              <Text variant="muted">Typography Lead</Text>
              <TypographyLead>
                A modal dialog that interrupts the user with important content
                and expects a response.
              </TypographyLead>
            </View>
            <View className="gap-2">
              <Text variant="muted">Typography Muted</Text>
              <TypographyMuted>Enter your email address.</TypographyMuted>
            </View>
            <View className="gap-2">
              <Text variant="muted">Palette</Text>
              <PaletteDemo />
            </View>
          </View>
        </ScrollView>
      </ScrollLockContext.Provider>
    </SafeAreaView>
  );
}
