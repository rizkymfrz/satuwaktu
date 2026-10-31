import { useState } from "react";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Text } from "@/components/ui/text";

function TabsDemo() {
  const [account, setAccount] = useState("account");
  const [line, setLine] = useState("overview");
  const [vertical, setVertical] = useState("general");
  return (
    <View className="gap-6">
      <Tabs value={account} onValueChange={setAccount}>
        <TabsList>
          <TabsTrigger value="account">
            <Text>Account</Text>
          </TabsTrigger>
          <TabsTrigger value="password">
            <Text>Password</Text>
          </TabsTrigger>
          <TabsTrigger value="billing" disabled>
            <Text>Billing</Text>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>
                Make changes to your account here.
              </CardDescription>
            </CardHeader>
            <CardContent className="gap-3">
              <Input placeholder="Name" />
              <Button>
                <Text>Save changes</Text>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password here. After saving, you&apos;ll be logged
                out.
              </CardDescription>
            </CardHeader>
            <CardContent className="gap-3">
              <Input placeholder="Current password" secureTextEntry />
              <Input placeholder="New password" secureTextEntry />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Tabs value={line} onValueChange={setLine}>
        <TabsList variant="line">
          <TabsTrigger value="overview">
            <Text>Overview</Text>
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <Text>Analytics</Text>
          </TabsTrigger>
          <TabsTrigger value="reports">
            <Text>Reports</Text>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Text variant="muted">A summary of your project.</Text>
        </TabsContent>
        <TabsContent value="analytics">
          <Text variant="muted">Traffic and engagement numbers.</Text>
        </TabsContent>
        <TabsContent value="reports">
          <Text variant="muted">Download monthly reports.</Text>
        </TabsContent>
      </Tabs>
      <Tabs orientation="vertical" value={vertical} onValueChange={setVertical}>
        <TabsList variant="line">
          <TabsTrigger value="general">
            <Text>General</Text>
          </TabsTrigger>
          <TabsTrigger value="security">
            <Text>Security</Text>
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Text>Notifications</Text>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="justify-center">
          <Text variant="muted">General settings.</Text>
        </TabsContent>
        <TabsContent value="security" className="justify-center">
          <Text variant="muted">Security settings.</Text>
        </TabsContent>
        <TabsContent value="notifications" className="justify-center">
          <Text variant="muted">Notification settings.</Text>
        </TabsContent>
      </Tabs>
    </View>
  );
}

export { TabsDemo };
