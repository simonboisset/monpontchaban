import { fr, schedules } from '@chaban/core';
import { RouteProp } from '@react-navigation/native';
import { Save, Trash, Undo2 } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { H5, H6, Slider, Text, View, XStack, YStack } from 'tamagui';
import { Button } from '../ui/Button';
import { IconButton } from '../ui/IconButton';
import { RoundedButton } from '../ui/RoundedButton';
import { Scrollable } from '../ui/Scrollable';
import { TextField } from '../ui/TextField';
import { RootStack } from './Navigator';
import { useNotificationRules } from './settings';

type RuleSettingsProps = { route: RouteProp<RootStack, 'NotificationRule'> };
export default function RuleSettings({ route }: RuleSettingsProps) {
  const { notificationRules, isNotificationRulesLoading, updateNotificationRule, isUpdating, deleteNotificationRule } =
    useNotificationRules();
  const [title, setTitle] = React.useState(notificationRules?.[0]?.title || '');
  const rule = notificationRules?.find((r) => r.id === route.params.id);
  const [scheduleIds, setScheduleIds] = React.useState(rule?.scheduleIds || []);
  const [delayMinBeforeInHours, setDelayMinBeforeInHours] = React.useState(
    Math.floor((rule?.delayMinBefore || 0) / 60),
  );

  const toggleSchedule = (id: number) => {
    if (scheduleIds.includes(id)) {
      setScheduleIds(scheduleIds.filter((s) => s !== id));
    } else {
      setScheduleIds([...scheduleIds, id]);
    }
  };

  const toggleDay = (day: number) => {
    const scheduleOfTheDay = schedules.filter((s) => s.day === day);
    if (scheduleIds.some((id) => scheduleOfTheDay.some((s) => s.id === id))) {
      setScheduleIds(scheduleIds.filter((id) => !scheduleOfTheDay.some((s) => s.id === id)));
    } else {
      setScheduleIds([...scheduleIds, ...scheduleOfTheDay.map((s) => s.id)]);
    }
  };

  const toggleAll = () => {
    if (scheduleIds.length > 0) {
      setScheduleIds([]);
    } else {
      setScheduleIds(schedules.map((s) => s.id));
    }
  };

  useEffect(() => {
    if (isNotificationRulesLoading || !rule) return;
    setTitle(rule.title);
    setScheduleIds(rule.scheduleIds);
    setDelayMinBeforeInHours(Math.floor((rule?.delayMinBefore || 0) / 60));
  }, [isNotificationRulesLoading, rule]);

  const saveRule = () => {
    if (!rule) return;
    const delayMinBefore = delayMinBeforeInHours * 60;

    const newRule = { ...rule, title, scheduleIds, delayMinBefore };
    updateNotificationRule(newRule);
  };
  const deleteRule = () => {
    if (!rule) return;
    deleteNotificationRule({ id: rule.id });
  };
  return (
    <View backgroundColor={'$primaryForeground'}>
      <Scrollable gap='$8' px='$4' py='$12'>
        <IconButton Icon={Undo2} href={['Settings']} position='absolute' left='$4' top='$12' />
        <IconButton color='error' Icon={Trash} position='absolute' right='$4' top='$12' onPress={deleteRule} />
        <Button label='Enregistrer' onPress={saveRule} RightIcon={Save} loading={isUpdating} mt={80} />
        <TextField label='Titre de la notication à afficher' defaultValue={rule?.title} onChange={setTitle} />
        <YStack gap='$4'>
          <H6 color={`$primary`}>Combien d'heures à l'avance souhaitez-vous recevoir la notification ?</H6>
          <Slider
            value={[delayMinBeforeInHours]}
            max={6}
            step={1}
            onValueChange={(v) => setDelayMinBeforeInHours(v[0])}>
            <Slider.Track bg='$primary'>
              <Slider.TrackActive bg='$primary' />
            </Slider.Track>
            <Slider.Thumb size='$2' index={0} circular elevate bg='$primaryForeground' borderColor={'$primary'} />
          </Slider>
          <Text color={`$primary`}>{delayMinBeforeInHours}h</Text>
        </YStack>
        <YStack gap='$4'>
          <H5 color={`$primary`}>Crénaux horaires</H5>
          <Text color={`$primary`}>
            Sélectionnez les jours et les crénaux horaires où vous souhaitez recevoir la notification
          </Text>
          <Text color={`$primary`}>
            Une notification ne sera envoyée si le pont se lève avant le créneau suivant en tenant compte du délai
            enregistré plus haut
          </Text>
          <Button label={scheduleIds.length > 0 ? 'Tout désélectionner' : 'Tout sélectionner'} onPress={toggleAll} />
          {[0, 1, 2, 3, 4, 5, 6].map((day) => {
            const scheduleOfTheDay = schedules.filter((s) => s.day === day);

            return (
              <YStack key={day} gap='$4' bg='$primaryTransparent' px='$4' pt='$2' pb='$4' borderRadius={14}>
                <H5 color={`$primary`}>{fr.weekDays[day]}</H5>
                <Button
                  label={
                    scheduleIds.some((id) => scheduleOfTheDay.some((s) => s.id === id))
                      ? 'Désélectionner ce jour'
                      : 'Sélectionner ce jour'
                  }
                  onPress={() => toggleDay(day)}
                />
                <XStack flexWrap='wrap' gap='$2' justifyContent='space-between'>
                  {schedules
                    .filter((s) => s.day === day)
                    .map((schedule) => (
                      <RoundedButton
                        key={schedule.id}
                        label={schedule.hour.toString()}
                        active={scheduleIds.includes(schedule.id)}
                        onPress={() => toggleSchedule(schedule.id)}
                      />
                    ))}
                </XStack>
              </YStack>
            );
          })}
        </YStack>
      </Scrollable>
    </View>
  );
}
