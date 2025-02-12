import { NextPage } from "next";
import {
  Box,
  Heading,
  Text,
  Button,
  Modal,
  ModalCloseButton,
  ModalOverlay,
  ModalBody,
  ModalHeader,
  ModalContent,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import { CannyWidget } from "../../../lib/components/CannyWidget";
import { useRouter } from "next/dist/client/router";
import { useBountyProgramStore } from "../../../lib/stores/BountyProgramsStore";
import { useUserStore } from "../../../lib/stores/UserStore";
import { QuestionTips } from "../../../lib/components/QuestionTips";
import { useEffect, useState } from "react";
import mixpanel from "mixpanel-browser";

const BountyPrograms: NextPage = () => {
  const router = useRouter();
  const bountyProgramStore = useBountyProgramStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [counter, setCounter] = useState<number>(0);
  const userStore = useUserStore();
  const bountyProgramSlug = router.query.bountyProgramSlug;

  useEffect(() => {
    mixpanel.track("page_view:bounty_programs:questions:individual", {
      bountyProgram: bountyProgramSlug,
    });
  }, []);

  if (!bountyProgramSlug) {
    return <></>;
  }

  if (userStore.isAuthenticated && counter == 0) {
    setCounter(1);
    setTimeout(() => {
      setCounter(2);
    }, 50);
  }

  const bountyProgram = bountyProgramStore.getBySlug(bountyProgramSlug);
  if (!bountyProgram) {
    window.location.assign("/");
    return <></>;
  }

  return (
    <Box width="100%">
      <Box
        margin="0 0 20px 0"
        backgroundColor="muted"
        padding="15px"
        borderRadius="4px"
      >
        <Heading fontSize="lg" fontFamily="mono">
          🕵️‍♀️ {bountyProgram.name} Bounty Question Proposals
        </Heading>
        <Text fontFamily="mono" fontSize="sm">
          <br />A space to propose and gather questions relevant to{" "}
          {bountyProgram.name}. What do you want to know about{" "}
          {bountyProgram.name}? Questions defined, and ranked here will form the
          basis of future Bounty Rounds by the MetricsDAO!
          <br />
          <br />
          See a question you want answered? Upvote it! The top 10 up-voted
          questions will make it into the next bounty round.
        </Text>
        <Button
          marginTop="15px"
          variant="secondary"
          onClick={() => {
            mixpanel.track("click:bounty_question_tips");
            onOpen();
          }}
        >
          🤔 How to Write a Good Question (click me to learn) 🤔
        </Button>
      </Box>
      <Box>
        {counter != 1 && (
          <CannyWidget boardToken={bountyProgram.bountyProgramID} />
        )}
      </Box>

      <Modal onClose={onClose} isOpen={isOpen} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontWeight="bold">
            Bounty Question Writing Tips
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <QuestionTips />
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default BountyPrograms;
